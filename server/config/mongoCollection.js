const mongoConnection = require("./mongoConnection");

const getCollection = (collection) => {
    let _collection = undefined;

    return async function () {
        if (!_collection) {
            const db = await mongoConnection.connecttoDB();
            _collection = await db.collection(collection);
        }
        return _collection;
    };
};

module.exports = {
    users: getCollection("users"),
    products: getCollection("products"),
    community: getCollection("community"),
    reviews:getCollection("reviews")
};
