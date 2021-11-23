const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

router.get("/home", (req, res) => {
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

module.exports = router;
