const express = require("express");
const router = express.Router();
const productData = require("../data/products");
const session = require("express-session");

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
router.post("/search", async (req, res) => {
  const body = req.body;
  //console.log("body", body);

  //console.log(option);
  let searchTerm = body.searchInput;
  let searchValue = body.searchSelect;
  //console.log(searchTerm);
  //console.log(searchValue);
  if (!searchTerm || searchTerm.trim().length == 0) {
    return "Error: Search term blank";
  } else {
    searchTerm = searchTerm.toLowerCase();
    console.log(searchTerm);
    //console.log(option.value);
    if (searchValue === "name") {
      try {
        let search_List = await productData.getProductByProductName(searchTerm);
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
        res.status(200).render("searchPage/searchPage", {
          products: search_List,
        });
      } catch (e) {
        return res.status(404).render("errorPage/noSearch");
      }
    }
  }
});

router.post("/addProduct", async (req, res) => {
  if (!req.session.AuthCookie) {
    res.status(401).redirect("/");
  } else {
    //check what all is required after making the front end form
    const {
      product_Name,
      description,
      website_Url,
      // logo,
      tags,
      developer,
    } = req.body;
  }
});
module.exports = router;
