const express = require("express");
const router = express.Router();
const productData = require("../data/products");
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

  //console.log(option);
  let searchTerm = body.searchInput;
  let searchValue = body.searchSelect;
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
    console.log(searchValue);
    if (searchValue === "name") {
      try {
        let search_List = await productData.getProductByProductName(searchTerm);
        console.log(search_List);
        //return only the json
        res.status(200).render("searchPage/searchPage", {
          products: search_List,
        });
      } catch (e) {
        return res.status(404).render("errorPage/noSearch");
      }
    }
    if (searchValue === "tag" || searchValue === "Search product by") {
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
  upload.single("logo"),
  authMiddleware,
  async (req, res) => {
    if (!req.session.AuthCookie) {
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
      let logo = req.file?.filename;
      logo = xss(logo);
      // console.log(productName);

      // console.log(websiteUrl);
      // console.log(tags);
      // //console.log()
      // console.log(developer);
      if (req.file && !req.file?.mimetype.includes("image")) {
        return res.status(400).json({ error: "Please upload an image" });
      }
      //Checking if input present in the first place
      if (!productName || !description || !websiteUrl || !tags || !developer) {
        return res
          .status(400)
          .json({ error: "Please provide all details of the product" });
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
        return res
          .status(400)
          .json({ error: "Details provided are not of proper type string" });
      }
      // Tags array-type check
      // if (
      //   !Array.isArray(tags) ||
      //   tags.length < 1 ||
      //   tags.forEach((elem) => {
      //     if (typeof elem !== "string" || elem.trim().length) {
      //       return res.status(400).json({ error: "Tags should be of type string" });
      //     }
      //   })
      // ) {
      //   return res
      //     .status(400)
      //     .json({ error: "Tag are empty or not of type of array" });
      // }
      let re =
        /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$/gm;
      if (!re.test(websiteUrl)) {
        return res.status(400).json({
          error: "Website URL provided does not satisfy proper criteria",
        });
      }
      const delRest = await restaurantCollection.findOne({
        productName: productName,
      });
      // finally calling the db function to add the product
      try {
        const newProduct = await productData.addProduct(
          productName,
          description,
          websiteUrl,
          logo,
          tags,
          developer
        );
        console.log(newProduct);
        return res.status(200).json(newProduct);
      } catch (e) {
        return res.status(500).json({ message: `${e}` });
      }
    }
  }
);

router.get(
  "/:id",
 async (req, res) => 
 {
  if (!req.params.id) {
    res.status(400).json({ error: "You must provide product id" });
    return;
  }
  try {
    if (!ObjectId.isValid(req.params.id)) throw "id is not valid.";
    const product = await productData.getProductById(req.params.id);
    if (typeof product === "undefined") throw "Not found with that id";

    let prodLiked = false;
    let userLogged = false;
    if (req.session.user) {
      const user = await userData.getUser(req.session.user);
      prodLiked = await userData.checkLikedProduct(
        user._id.toString(),
        req.params.id
      );
      userLogged = true;
    }
    res.render(
      "products/product", 
      {
      prodLiked: prodLiked,
      productName: product.productName,
      logo: product.logo,
      site: product.websiteUrl,
      tags: product.tags,
      developer: product.developer,
      rating: product.rating,
      likes: product.likes,
      description: product.description,
      userLogged: userLogged,
    });
    return;
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/updateLike", 
  async (req, res) => 
  {
  if (!req.session.user) {
    console.log("need to login inorder to like");
    return;
  }

  try {
    await productData.updateCount(req.body.productId, req.body.liked);
    const user = await userData.getUser(req.session.user);
    await userData.updateLikedProducts(user._id.toString(), req.body.productId);
  } catch (e) {
    res.status(401).json({ error: "e" });
  }
});

module.exports = router;
