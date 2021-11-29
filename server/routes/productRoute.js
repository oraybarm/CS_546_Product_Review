const express = require("express");
const router = express.Router();
const productData = require("../data/products");
const session = require("express-session");

router.post("/search", async (req, res) => {
  const body = req.body;
  let option = document.getElementById("searchSelect");
  console.log(option);
  let searchTerm = body.search;
  if (!searchTerm || searchTerm.trim() == 0) {
    return "Error: Search term blank";
  } else {
    searchTerm = searchTerm.toLowerCase();
    console.log(searchTerm);
    if (option.value === "By Name") {
      try {
        let search_List = await products.getProductByProductName(body.search);
        res.status(200).render("homePage/homePage", {
          products: search_List,
        });
      } catch (e) {
        return res.status(404).render("errorPage/noSearch");
      }
    }
    if (option.value === "By Tag") {
      try {
        let search_List = await products.getProductbyTag(body.search);
        res.status(200).render("homePage/homePage", {
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
