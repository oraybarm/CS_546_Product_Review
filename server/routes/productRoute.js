const express = require("express");
const router = express.Router();
const productData = require("../data/products");
const { authMiddleware } = require("../middlewares/auth");
const session = require("express-session");
const xss = require("xss");
const multer = require("multer");
const userData = require("../data/users");
const { ObjectId } = require("mongodb");

const reviews = require("../data/reviews");
const { getUser } = require("../data/users");
const isValidString = require("../utils");
const _ = require("lodash");

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

router.get("/addProducterror", (req, res) => {
  const { addProductError } = req.session;
  const error = addProductError;
  req.session.addProductError = false;
  return res.status(200).json({
    error: addProductError,
  });
});

router.post(
  "/addProduct",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    if (!req.session.user) {
      res.status(401).redirect("/");
    } else {
      req.session.addProductError = false;
      //check what all is required after making the front end form
      let { productName, description, websiteUrl, tags, developer } = req.body;
      productName = xss(productName);
      description = xss(description);
      websiteUrl = websiteUrl.toLowerCase().trim();
      websiteUrl = xss(websiteUrl);
      tags = xss(tags);
      developer = xss(developer);
      if (!req.file)
        return res.status(400).json({ error: "Please provide a file" });
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
      if (
        productName.trim().length < 1 ||
        description.trim().length < 1 ||
        websiteUrl.trim().length < 1 ||
        tags.trim().length < 1 ||
        developer.trim().length < 1
      ) {
        return res.status(400).json({
          error: "Please provide ensure there are no blank details",
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
      tags = tags.trim().toUpperCase();
      let tagsList = tags.split(",");
      tagsList = new Set(tagsList);
      tagsList = Array.from(tagsList);
      let re =
        /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{2}\.([a-z]+)?$/gm;
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
          tagsList,
          developer
        );
        console.log("new", newProduct);
        res.redirect("/");
      } catch (e) {
        console.log("error", e);
        req.session.addProductError = e;
        res.redirect("/");
        // res.redirect("/products/addProducterror");
        // return res.status(500).json({ message: e, errorMessage: e });
      }
    }
  }
);

router.get("/:id", async (req, res) => {
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
    let usernow = "";
    if (req.session.user) {
      const user = await getUser(req.session.user);
      usernow = user._id;
    }

    const review = await reviews.getReviewbyProductId(req.params.id);
    const userlist = [];
    for (let i = 0; i < review.length; i++) {
      let userInfo = await reviews.getUserByReviewId(review[i]._id);
      userlist.push(userInfo);
    }
    let posts = [];
    let hasPost = false;
    for (let i = 0; i < review.length; i++) {
      let output = review[i];
      //output["username"] = userlist[i].firstName.concat(userlist[i].lastName);
      output["username"] = userlist[i].name;
      output["image"] = !_.isEmpty(userlist[i].img)
        ? `/public/images/upload/${userlist[i].img}`
        : "/public/images/guest-user.jpg";
      output["userId"] = userlist[i]._id;
      if (usernow.toString() == userlist[i]._id.toString()) {
        output["usernow"] = true;
      } else {
        output["usernow"] = false;
      }
      if (output) {
        posts.push(output);
      }
    }
    if (posts.length > 0) {
      hasPost = true;
    }
    res.render("products/product", {
      authenticated: req.session.user ? true : false,
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
      posts: posts,
      hasPost: hasPost,
      productid: req.params.id,
    });
    return;
  } catch (e) {
    console.log(e);
    res.render("errorPage/404");
  }
});

router.post("/updateLike", authMiddleware, async (req, res) => {
  if (!req.session.user) {
    res.redirect("users/signup");
    return;
  }

  try {
    await productData.updateCount(req.body.productId, req.body.liked);
    const user = await userData.getUser(req.session.user);
    await userData.updateLikedProducts(user._id.toString(), req.body.productId);
  } catch (e) {
    res.redirect(`/products/${req.body.productId}`);
  }
});

module.exports = router;
