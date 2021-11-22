const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("test default home:>> ");
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

router.get("/home", (req, res) => {
  console.log("in home page", req.session);
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

module.exports = router;
