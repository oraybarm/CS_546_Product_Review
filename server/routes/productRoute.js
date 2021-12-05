const express = require("express");
const router = express.Router();
const productData = require("../data/products");
const { authMiddleware } = require("../middlewares/auth");
const session = require("express-session");
const xss = require("xss");
const multer = require("multer");
// router.get("/", async (req, res) => {
//   try {
//     let prodList = await productData.getAllProducts();
//     res.status(200).render("homePage/homePage", {
//       products: prodList,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(404).send(e);
//   }
// });

//Multer Functions required
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/images/upload");
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.post("/search", async (req, res) => {
  const body = req.body;
  //console.log("body", body);
  //body = xss(body);
  //console.log(option);
  let searchTerm = body.searchInput;
  let searchValue = body.searchSelect;
  searchTerm = xss(searchTerm);
  searchValue = xss(searchValue);
  //console.log(searchTerm);
  //console.log(searchValue);
  if (!searchTerm || searchTerm.trim().length == 0) {
    res.status(404).render("errorPage/noSearch", {
      message: "Search bar should not be blank",
    });
    return "Error: Search term blank";
  } else {
    searchTerm = searchTerm.toLowerCase();
    //console.log(searchTerm);
    //console.log(searchValue);
    if (searchValue === "name" || searchValue === "Search product by") {
      try {
        let search_List = await productData.getProductByProductName(searchTerm);
        //console.log(search_List);
        //return only the json
        res.status(200).render("searchPage/searchPage", {
          products: search_List,
        });
      } catch (e) {
        return res.status(404).render("errorPage/noSearch");
      }
    }
    if (searchValue === "tag") {
      try {
        let search_List = await productData.getProductbyTag(searchTerm);
        //console.log(search_List);
        res.status(200).render("searchPage/searchPage", {
          products: search_List,
        });
      } catch (e) {
        return res.status(404).render("errorPage/noSearch");
      }
    }
  }
});

router.post(
  "/addProduct",
  upload.single("photo"),
  authMiddleware,
  async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect("/");
    } else {
      //check what all is required after making the front end form
      let { productName, description, websiteUrl, tags, developer } = req.body;
      productName = productName.toLowerCase();
      productName = xss(productName);
      description = xss(description);
      websiteUrl = websiteUrl.toLowerCase();
      websiteUrl = xss(websiteUrl);
      tags = xss(tags);
      developer = developer.toLowerCase();
      developer = xss(developer);
      let photo = req.file.filename;
      photo = xss(photo);
      console.log(productName);

      if (req.file && !req.file.mimetype.includes("image")) {
        return res.status(400).json({ error: "Please upload an image" });
      }
      //Checking if input present in the first place
      if (!productName || !description || !websiteUrl || !tags || !developer) {
        return res.status(400).json({
          error: "Please provide all details of the product",
        });
      }
      productName = productName.trim().toLowerCase();
      // String typecheck
      if (
        typeof productName !== "string" ||
        typeof description !== "string" ||
        typeof websiteUrl !== "string" ||
        typeof tags !== "string" ||
        typeof developer !== "string"
      ) {
        return res.status(400).json({
          error: "Details provided are not of proper type string",
        });
      }
      let tagslist = tags.split(",");
      let tagarr = [];
      for (let i = 0; i < tagslist.length; i++) {
        let tag = {};
        tag["name"] = tagslist[i];
        tagarr.push(tag);
      }
      let re =
        /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$/gm;
      if (!re.test(websiteUrl)) {
        return res.status(400).json({
          error:
            "Website URL provided does not satisfy proper criteria (route)",
        });
      }
      try {
        const newProduct = await productData.addProduct(
          productName,
          description,
          websiteUrl,
          photo,
          tagarr,
          developer
        );
        console.log(newProduct);
        res.redirect("/");
      } catch (e) {
        return res.status(500).json({ message: `${e}` });
      }
    }
  }
);

module.exports = router;
