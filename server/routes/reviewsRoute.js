const express = require("express");
const reviews = require("../data/reviews");
const { getUser } = require("../data/users");
const users = require("../data/users");
const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();

router.get("/:id",async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
      }
      try {
        const review = await reviews.getReviewById(req.params.id);
        res.json(review);
      } catch (e) {
        res.status(404).json({ error: e });
      }
  });

router.get("/product/:id",authMiddleware, async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
    try {
        const user=await getUser(req.session.user);
        const usernow=user._id;
        const review = await reviews.getReviewbyProductId(req.params.id);
        const userlist=[];
        for(let i=0;i<review.length;i++){
          console.log(review[i]._id);
          let userInfo=await reviews.getUserByReviewId(review[i]._id);
          userlist.push(userInfo);
        }    
        console.log(userlist);
        let posts = [];
        let hasPost = false;
        for (let i = 0; i < review.length; i++) {
          let output = review[i];
          output["username"]=userlist[i].firstName.concat(userlist[i].firstName);
          output["image"]=userlist[i].photo.data.concat(userlist[i].photo.contentType);
          output["userId"]=userlist[i]._id;
          output["usernow"]=(usernow==userlist[i]._id);
          if (output) {
            posts.push(output);
          }
        }
        if (posts.length > 0) {
          hasPost = true;
        }
        res.render('review/review',{posts: posts, hasPost:hasPost});
    } catch (e) {
        res.status(404).json({ error: 'review not found' });
    }
});

router.get('/', async (req, res) => {
    res.render('review/review');
  });

router.post('/',authMiddleware, async (req, res) => {
  console.log(req.body);
  const user=await getUser(req.session.user);
  const review = req.body.content;
  const rating = req.body.rateval;
  let result;
  let addreviewtouser;
  try{
    result=await reviews.AddReview("619d59f6ef4d9cffbf59ef13", review, rating);//this id is productid
    console.log(result.insertedId);
    addreviewtouser=await reviews.AddReviewToUser(user._id,result.insertedId);
  }catch(e){
    console.log(e);
    res.status(400).render('review/review');
  }
});

router.post('/update', async (req, res) => {
  console.log(req.body);
  const review = req.body.description;
  const rating = req.body.rating;
  let result;
  try{
    result=await reviews.updateReviewbyId(id,review,rating);
    console.log(result);
  }catch(e){
    console.log(e);
    res.status(400).render('review/review');
  }
});

router.post('/delete',authMiddleware, async (req, res) => {
  console.log(req.body.reviewId);
  const reviewId=req.body.reviewId;
  const user=await getUser(req.session.user);
  let result;
  try{
    result=await reviews.deleteReview(reviewId);
    console.log(result.DeletedId);
    Deletereviewtouser=await reviews.DeleteReviewToUser(user._id,result.DeletedId);
  }catch(e){
    console.log(e);
    res.status(400).render('review/review');
  }
});

  module.exports = router;