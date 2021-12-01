const express = require("express");
const router = express.Router();
const charts = require("../data/visual/getcisualchartdata");

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

router.get("/home/chart", async(req, res) => {
  try {
    const chart = await charts.getVisualData();
    res.json(chart);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
