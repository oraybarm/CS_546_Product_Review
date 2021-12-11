const mongoCollections = require("../config/mongoCollection");
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const products = mongoCollections.products;
const { ObjectId } = require("mongodb");
const userfun = require("./users");
const productData = require("./products");

function checkString(str) {
  if (str === undefined) {
    throw ` The string doesn't exist!`;
  }
  if (typeof str !== "string") {
    throw `The string ${str} you input is not an string!`;
  }
  if (str.length === 0) {
    throw `The string you input is empty!`;
  }
  let strremovespace = str.replace(/\s*/g, "");
  if (strremovespace.length === 0) {
    throw `Don't fool me! The string you input are all empty!`;
  }
}

function myDBfunction(id) {
  //check to make sure we have input at all
  if (!id) throw "Id parameter must be supplied";
  //check to make sure it's a string
  if (typeof id !== "string") throw "Id must be a string";
  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  let parsedId = ObjectId(id);
  //this console.log will not get executed if Object(id) fails, as it will throw an error
  //console.log('Parsed it correctly, now I can pass parsedId into my query.');
  return parsedId;
}

const exportedMethods = {
  async getReviewById(reviewId) {
    if (!reviewId) throw "You must provide an id to search for";
    reviewId = reviewId.toString();
    checkString(reviewId);
    reviewId = myDBfunction(reviewId);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (review === null) throw "No review with that id";
    return review;
  },

  async getReviewbyProductId(productId) {
    productId = productId.toString();
    checkString(productId);
    productId = myDBfunction(productId);
    const reviewCollection = await reviews();
    const review = await reviewCollection
      .find({ product: productId })
      .toArray();
    if (review === null) throw "No review with that product id";
    return review;
  },

  async AddReview(productId, description, rating) {
    if (!productId) throw "You must provide a productId for review!";
    if (!description) throw "You must provide a description for review!";
    if (!rating) throw "You must provide a rating for review!";
    checkString(description);
    checkString(rating);
    productId = productId.toString();
    checkString(productId);
    productId = myDBfunction(productId);

    const reviewCollection = await reviews();
    let newReview = {
      rating: rating,
      description: description,
      product: productId,
    };
    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0) throw "Could not add review";

    let rateall = 0;
    const prodreview = await this.getReviewbyProductId(productId);
    for (let i = 0; i < prodreview.length; i++) {
      rateall = parseInt(prodreview[i].rating) + rateall;
    }
    let averagerate = rateall / prodreview.length;
    averagerate = averagerate.toFixed(2);
    const prodCollection = await products();
    const updated = {
      rating: averagerate,
    };

    const updatedInfo = await prodCollection.updateOne(
      { _id: productId },
      { $set: updated }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update rating failed";

    return insertInfo;
  },

  async AddReviewToUser(userid, reviewId) {
    if (!userid) throw "You must provide an id";
    userid = userid.toString();
    checkString(userid);
    userid = myDBfunction(userid);
    if (!reviewId) throw "You must provide an id";
    reviewId = reviewId.toString();
    checkString(reviewId);
    reviewId = myDBfunction(reviewId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userid });
    if (user === null) throw "No userid with that id";
    const reviewCollection = await users();
    let newRest = {
      _id: reviewId,
    };
    const updateInfo = await reviewCollection.updateOne(
      { _id: userid },
      { $addToSet: { reviews: newRest } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return "Add review to user successfully!";
  },

  async getUserByReviewId(id) {
    if (!id) throw "You must provide an id";
    id = id.toString();
    id = myDBfunction(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ "reviews._id": id });
    if (user === null) throw "No user with that review id";
    let userInfo = {};
    userInfo["_id"] = user._id;
    // userInfo["firstName"]=user.firstName;
    // userInfo["lastName"]=user.lastName;
    userInfo["name"] = user.name;
    userInfo["img"] = user.photo;
    return userInfo;
  },

  async updateReviewbyId(id, description, rating) {
    if (!id) throw "You must provide an id to update";
    if (!description) throw "You must provide a description";
    id = id.toString();
    checkString(id);
    checkString(description);
    checkString(rating);
    rating = parseInt(rating);
    if (isNaN(rating)) {
      throw " Rating is not a number!";
    } else if (rating < 1 || rating > 5) {
      throw "Rating must be a number between 1 and 5";
    }
    id = myDBfunction(id);
    const reviewCollection = await reviews();
    const updated = {
      description: description,
      rating: rating,
    };

    const updatedInfo = await reviewCollection.updateOne(
      { _id: id },
      { $set: updated }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw "could not update successfully";
    }

    const rev = await this.getReviewById(id);
    let productId = rev.product;
    let rateall = 0;
    const prodreview = await this.getReviewbyProductId(productId);
    console.log(prodreview);
    for (let i = 0; i < prodreview.length; i++) {
      rateall = parseInt(prodreview[i].rating) + rateall;
    }
    let averagerate = rateall / prodreview.length;
    averagerate = averagerate.toFixed(2);
    const prodCollection = await products();
    const updatedp = {
      rating: averagerate,
    };

    const updatedInfop = await prodCollection.updateOne(
      { _id: productId },
      { $set: updatedp }
    );
    if (!updatedInfop.matchedCount && !updatedInfop.modifiedCount)
      throw "Update rating failed";

    return "update successfully";
  },

  async deleteReview(reviewId) {
    if (!reviewId) throw "You must provide an id to search for";

    checkString(reviewId);

    reviewId = myDBfunction(reviewId);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (review === null) throw "No review with that id";

    const rev = await this.getReviewById(reviewId);
    let productId = rev.product;

    const deletionInfo = await reviewCollection.deleteOne({
      _id: reviewId,
    });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete restaurant with id of ${reviewId}`;
    }

    let rateall = 0;
    const prodreview = await this.getReviewbyProductId(productId);
    console.log(prodreview);
    for (let i = 0; i < prodreview.length; i++) {
      rateall = parseInt(prodreview[i].rating) + rateall;
    }
    let averagerate = rateall / prodreview.length;
    averagerate = averagerate.toFixed(2);
    const prodCollection = await products();
    const updatedp = {
      rating: averagerate,
    };

    const updatedInfop = await prodCollection.updateOne(
      { _id: productId },
      { $set: updatedp }
    );
    if (!updatedInfop.matchedCount && !updatedInfop.modifiedCount)
      throw "Update rating failed";

    return reviewId;
  },

  async DeleteReviewToUser(userid, reviewId) {
    if (!userid) throw "You must provide an id";
    userid = userid.toString();
    checkString(userid);
    userid = myDBfunction(userid);
    if (!reviewId) throw "You must provide an id";
    reviewId = reviewId.toString();
    checkString(reviewId);
    reviewId = myDBfunction(reviewId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userid });
    if (user === null) throw "No userid with that id";
    const reviewCollection = await users();
    const updateInfo = await reviewCollection.updateOne(
      { _id: userid },
      { $pull: { reviews: { _id: reviewId } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return "Delete review to user successfully!";
  },

  async getReviewsByUser(id) {
    if (typeof id === "undefined") throw "id is not provided";
    id = id.toString();
    checkString(id);
    //checks if id is a valid objectId else throw error
    if (!ObjectId.isValid(id)) throw "id is not a valid objectId";
    const user = await userfun.getUserById(id);
    //user._id=user._id.toString();
    const reviewsid = await userfun.getReviewsByUserId(user._id);
    let reviewlist = [];
    let review = {};
    for (let i = 0; i < reviewsid.length; i++) {
      review = await this.getReviewById(reviewsid[i]._id);
      const product = await productData.getProductById(review.product);
      reviewlist.push({
        ...review,
        productName: product.productName,
        productImg: product.logo,
      });
    }
    return reviewlist;
  },
};

module.exports = exportedMethods;
