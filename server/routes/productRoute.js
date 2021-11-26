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
        return res.status(500).message(e.message);
      }
    }
    if (option.value === "By Tag") {
      try {
        let search_List = await products.getProductbyTag(body.search);
      } catch (e) {
        return res.status(500).send();
      }
    }
  }
});
