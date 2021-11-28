const mongoCollections = require("../config/mongoCollections.js");
const products = mongoCollections.products;
let { ObjectId } = require("mongodb");

function checkInputs(
    product_Name,
    description,
    website_Url,
    logo,
    tags,
    developer
) {
    //If arguments are not provided
    if (
        !product_Name ||
        !description ||
        !website_Url ||
        !tags ||
        !developer ||
        !logo
    )
        throw "Error: All arguments have not been provided";
    // check if type is alright
    if (typeof product_Name !== "string" || product_Name.trim().length < 1) {
        throw "Error: product_name, description and website_Url are not strings";
    }
    if (typeof description !== "string" || description.trim().length < 1)
        throw "Error Descritpion is not a string";
    if (typeof website_Url !== "string" || website_Url.trim().length < 1)
        throw "Error: website_Url is not a string";
}
//
// Just a helper function to check db id's
//
function checkID(id) {
    if (!id) throw "Error: Please provide argument id";
    //if (typeof id !== "string") throw "Error:ID is not of string type.";
    if (typeof id === "string" && id.trim().length < 1) {
        //console.log(typeof id);
        throw "Error: ID is a blank string has been passed as argument";
    }
    //console.log(ObjectId.isValid(id));
    if (!ObjectId.isValid(id))
        throw "Error: Provided ID is not valid argument (data)";
}
let exportedMethods = {
    async getProductById(product_Id) {
        checkID(product_Id);
        objId_product = ObjectId(product_Id);
        const prod_List = await products();
        const prodId = await products.findOne({ _id: objId_product });
        if (prodId === null) throw "No product found";
        return prodId;
    },
    //addProduct method
    // Need to still check how images will be added to this
    async addProduct(
        product_Name,
        description,
        website_Url,
        logo,
        tags,
        developer
    ) {
        checkInputs(
            product_Name,
            description,
            website_Url,
            logo,
            tags,
            developer
        );
        const productList = await products();
        let new_Product = {
            product_name: product_Name,
            description: description,
            website_Url: website_Url,
            logo: { data: logo.data, contentType: logo.contentType },
            tags: tags,
            developer: developer,
            rating: 0.0,
            likes: 0,
        };
        const insert_Prod = await productList.insertOne(new_Product);
        if (insert_Prod.insertedCount === 0)
            throw "We are sorry. An error occured while adding the product. Please try again.";
        const dbId = await insert_Prod.insertedId;
        //console.log(typeof dbId);
        const add_Product = await this.get(dbId.toString());
        //console.log(typeof addRest);
        return add_Product;
    },

    //
    // This a helper function is used to increment the like counter by 1
    //
    async updateCount(product_Id, action) {
        objId = ObjectId(product_Id);
        const productCollection = await products();
        const product_Id = await productCollection.findOne({ _id: objId });
        if (restaurantID === null) throw "No restaurant with this ID";
        if (action === true) {
            let updated_Like = parseInt(product_Id.likes) + 1;
        } else {
            let updated_Like = parseInt(product_Id.likes) - 1;
        }
        const updated_detials = { likes: updated_Like };
        const updated = await productCollection.updateOne({
            _id: objId,
            $set: updated_detials,
        });
        if (updated.modifiedCount === 0) {
            throw "Could not update the product because it was not found in the database";
        }
        return await this.get(objId);
    },

    //
    // This function will get a product by name search
    // using something called text search from Mongo db-  don't need this
    //returns array of objects containing matches

    //https://www.guru99.com/regular-expressions-mongodb.html - this talks about using

    async getProductByProductName(textToSearch) {
        if (typeof textToSearch !== "string")
            throw "Error: The input is not a string";
        textToSearch = textToSearch.toLowerCase();
        const query = new RegExp(textToSearch, "i");
        const productCollection = await products();

        const productByName = await productCollection
            .find({
                product_Name: { $regex: query },
            })
            .toArray()
            .sort(productByName.likes);
        if (!productByName) throw "Error: No Matches";

        return productByName;
    },

    //
    // This function will get a product by tag
    //
    async getProductbyTag(tagSearch) {
        if (typeof tagSearch !== "string")
            throw "Error: The input is not a string";
        tagSearch = tagSearch.toLowerCase();
        const query = new RegExp(textToSearch, "i");
        const productCollection = await products();
        const productByTag = await productCollection
            .find({
                tags: { $regex: query },
            })
            .toArray()
            .sort(productByTag.likes);
        if (!productByTag) throw "Error: No Matches";
        return productByTag;
    },

    //
    // This function will delete a product
    //
    async deleteProduct(user_Id, product_Id) {
        checkID(user_Id);
        checkID(product_Id);
        objId_user = ObjectId(user_Id);
        objId_product = ObjectId(product_Id);
        const prooductCollection = await products();
        const delProduct = await productCollection.findOne({
            _id: objId_product,
        });
        if (!delProduct) throw "Error:Product not found!";
        updateCount(objId_product, false);
        // we need to authenticate the user tryig to delete the product info

        if (removed.deletedCount == 0) {
            throw `Could not delete Restaurant ${delProduct.name}`;
        } else {
            return `${delProduct.name} has been successfully deleted!`;
        }
    },
};
module.exports = exportedMethods;
