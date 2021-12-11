const express = require("express");
const reviews = require("../data/reviews");
const { getUser } = require("../data/users");
const users = require("../data/users");
const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();
const {
  isValidString,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} = require("../utils");
const xss = require("xss");
router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "You must provide ID" });
    return;
  }
  try {
    const review = await reviews.getReviewById(req.params.id);
    res.json(review);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/product/:id", authMiddleware, async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "You must provide ID" });
    return;
  }
  try {
    const user = await getUser(req.session.user);
    const usernow = user._id;
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
      output["username"] = userlist[i].firstName.concat(userlist[i].lastName);
      output["image"] = userlist[i].img;
      output["userId"] = userlist[i]._id;
      output["usernow"] = usernow == userlist[i]._id;
      if (output) {
        posts.push(output);
      }
    }
    if (posts.length > 0) {
      hasPost = true;
    }
    res.render("review/review", { posts: posts, hasPost: hasPost });
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
  }
});

router.get("/", async (req, res) => {
  res.render("review/review");
});

router.post("/", authMiddleware, async (req, res) => {
  console.log(req.body);
  try {
    let user = await getUser(req.session.user);
    let review = req.body.content;
    let rating = req.body.rateval;
    let productid = req.body.productid;
    review = xss(review);
    rating = xss(rating);
    productid = xss(productid);
    let result;
    let addreviewtouser;
    isValidString(review, "review");
    isValidString(rating, "rating");
    //this id is productid(get from product description page,but we don't have product page now)
    result = await reviews.AddReview(productid, review, rating);
    if (!user._id) {
      throw "Unable to get user Id";
    }
    addreviewtouser = await reviews.AddReviewToUser(
      user._id,
      result.insertedId
    );
  } catch (e) {
    if (!e.code) {
      console.log(e);
      res.status(400).render("review/review");
    } else {
      res.status(500).render("errorPage/errorHandling", {
        title: "OOPS!",
        message: `Internal Server error.${e.message}`,
      });
    }
  }
});

router.post("/update", async (req, res) => {
  //console.log(req.body);
  try {
    let review = req.body.newdes;
    let rating = req.body.newrate;
    let reviewid = req.body.reviewId;
    review = xss(review);
    rating = xss(rating);
    reviewid = xss(reviewid);
    let result;
    isValidString(review, "review");
    isValidString(rating, "rating");
    result = await reviews.updateReviewbyId(reviewid, review, rating);
    console.log(result);
  } catch (e) {
    if (!e.code) {
      console.log(e);
      res.status(400).render("review/review");
    } else {
      res.status(500).render("errorPage/errorHandling", {
        title: "OOPS!",
        message: `Internal Server error. ${e.message}`,
      });
    }
  }
});

router.post("/delete", authMiddleware, async (req, res) => {
  try {
    let reviewId = req.body.reviewId;
    reviewId = xss(reviewId);
    const user = await getUser(req.session.user);
    let result;
    isValidString(reviewId, "reviewId");
    result = await reviews.deleteReview(reviewId);
    if (!user._id) {
      throw { message: "Unable to get user Id", code: 500 };
    }
    Deletereviewtouser = await reviews.DeleteReviewToUser(user._id, result);
  } catch (e) {
    if (!e.code) {
      console.log(e);
      res.status(400).render("review/review");
    } else {
      res.status(500).render("errorPage/errorHandling", {
        title: "OOPS!",
        message: `Internal Server error. ${e.message}`,
      });
    }
  }
});

module.exports = router;
