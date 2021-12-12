// import usersData from "./users";
// import data_Products from "./products";
// import community from "./community";
const usersData = require('./users');
const data_Products = require('./products');
const community = require('./community');
const reviewsData = require('./reviews');

module.exports = {
    users: usersData,
    products: data_Products,
    community: community,
    reviews:reviewsData
};
