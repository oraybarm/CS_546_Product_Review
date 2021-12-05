const mongoCollections = require('../config/mongoCollection');
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

function checkString(str){
  if(str===undefined){
      throw` The string doesn't exist!`;
  }
  if(typeof str!=='string'){
      throw`The string ${str} you input is not an string!`;
  }
  if(str.length===0){
      throw`The string you input is empty!`;
  }
  let strremovespace = str.replace(/\s*/g,"");
  if(strremovespace.length===0){
      throw`Don't fool me! The string you input are all empty!`;
  }    
}

function myDBfunction(id) {
  //check to make sure we have input at all
  if (!id) throw 'Id parameter must be supplied';
  //check to make sure it's a string
  if (typeof id !== 'string') throw "Id must be a string";
  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  let parsedId = ObjectId(id);
  //this console.log will not get executed if Object(id) fails, as it will throw an error
  //console.log('Parsed it correctly, now I can pass parsedId into my query.');
  return parsedId;
}

const exportedMethods = {
  
    async getReviewById(reviewId) {
      if (!reviewId) throw 'You must provide an id to search for';
      checkString(reviewId);
      reviewId=myDBfunction(reviewId);
      const reviewCollection = await reviews();
      const review = await reviewCollection.findOne({ _id: reviewId});
      if (review === null) throw 'No review with that id';
      return review;
    },
  
    async getReviewbyProductId(productId) {
      checkString(productId);
      productId=myDBfunction(productId);
      const reviewCollection = await reviews();
      const review = await reviewCollection.find({product:productId}).toArray();
      if (review === null) throw 'No review with that product id';
      return review;
    },
    
    async AddReview(productId,description,rating) {
    if (!productId) throw 'You must provide a productId for review!';
    if (!description) throw 'You must provide a description for review!';
    if (!rating) throw 'You must provide a rating for review!';
    checkString(description);
    checkString(rating);
    checkString(productId);
    productId=myDBfunction(productId);
    
    const reviewCollection = await reviews();
    let newReview= {
        rating:rating,
        description:description,
        product:productId
      };
    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) throw 'Could not add review';
    return insertInfo;
    },

    async AddReviewToUser(userid,reviewId){
      if (!userid) throw 'You must provide an id';
      checkString(userid);
      id=myDBfunction(userid);
      if (!reviewId) throw 'You must provide an id';
      checkString(reviewId);
      id=myDBfunction(reviewId);
      const userCollection = await users();
      const user = await userCollection.findOne({ _id: userid });
      if (user === null) throw 'No userid with that id';
      const reviewCollection = await users();
      let newRest = {
        _id:reviewId
      };
      const updateInfo = await reviewCollection.updateOne(
        { _id: userid },
        { $addToSet: { reviews: newRest }} 
      );
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';
      return "Add review to user successfully!";
    },

    async getUserByReviewId(id){
      if (!id) throw 'You must provide an id';
      checkString(id);
      id=myDBfunction(id);
      const userCollection = await users();
      const user = await userCollection.findOne({ 'reviews._id' : id});
      if (user === null) throw 'No user with that review id';
      let userInfo={};
      userInfo["_id"]=user._id;
      userInfo["firstName"]=user.firstName;
      userInfo["lastName"]=user.lastName;
      userInfo["img"]=user.photo.data.concat(user.photo.contentType);
      return userInfo;
    },
    
    async updateReviewbyId(id,description,rating) {
      if (!id) throw 'You must provide an id to update';
      if (!description) throw 'You must provide a description';
      checkString(id);
      checkString(description);
      checkString(rating);
      rating=parseInt(rating);
      if(isNaN(rating)){
        throw " Rating is not a number!";
      }else if(rating<1 || rating >5 ){
        throw "Rating must be a number between 1 and 5"
      }
      id=myDBfunction(id);
      const reviewCollection = await reviews();
      const updated = {
        description: description,
        rating:rating
      };
  
      const updatedInfo = await  reviewCollection.updateOne(
        { _id: id },
        { $set: updated }
      );
      if (updatedInfo.modifiedCount === 0) {
        throw 'could not update successfully';
      }
      return "update successfully";
    },


    async deleteReview(reviewId) {
      if (!reviewId) throw 'You must provide an id to search for';
      checkString(reviewId);

      reviewId=myDBfunction(reviewId);
      const reviewCollection = await reviews();
      const review = await reviewCollection.findOne({ _id: reviewId});
      if (review === null) throw 'No review with that id';
      
      const deletionInfo = await reviewCollection.deleteOne({ _id: reviewId });
  
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete restaurant with id of ${reviewId}`;
      }
      return  deletionInfo;
    },

    async DeleteReviewToUser(userid,reviewId){
      if (!userid) throw 'You must provide an id';
      checkString(userid);
      id=myDBfunction(userid);
      if (!reviewId) throw 'You must provide an id';
      checkString(reviewId);
      id=myDBfunction(reviewId);
      const userCollection = await users();
      const user = await userCollection.findOne({ _id: userid });
      if (user === null) throw 'No userid with that id';
      const reviewCollection = await users();
      const updateInfo = await reviewCollection.updateOne(
        { _id: userid },
        { $pull: { reviews: {"_id":reviewId}}}
      );
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';
      return "Delete review to user successfully!";
    },
  };
  
  module.exports = exportedMethods;
  