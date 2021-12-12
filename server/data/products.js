const mongoCollections = require("../config/mongoCollection");
const products = mongoCollections.products;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const reviewData = require("./reviews");
const { isValidObject, addhttp, isValidEmail } = require("../utils.js");
function checkInputs(
  productName,
  description,
  websiteUrl,
  logo,
  tags,
  developer
) {
  //If arguments are not provided
  if (
    !productName ||
    !description ||
    !websiteUrl ||
    !tags ||
    !developer ||
    !logo
  )
    throw "Error: All arguments have not been provided";
  // check if type is alright
  if (typeof productName !== "string" || productName.trim().length < 1) {
    throw "Error: productName is not strings";
  }
  if (typeof description !== "string" || description.trim().length < 1)
    throw "Error Descritpion is not a string";
  if (typeof websiteUrl !== "string" || websiteUrl.trim().length < 1)
    throw "Error: website_Url is not a string";

  let re =
    /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{2}\.([a-z]+)?$/gm;
  if (!re.test(websiteUrl)) {
    throw "Error: website url is not valid.";
  }
  if (!Array.isArray(tags) || tags.length === 0)
    throw "Error: Tag is not of string type or tag field is empty";
  //let parsedTags = [...new Set(tags)];
  for (let i = 0; i < tags.length; i++) {
    if (typeof tags[i] !== "string" || tags[i].trim().length < 1) {
      throw "Error: Tag is not of string type or tag field is empty";
    }
  }
}

//
// Just a helper function to check db id's
//
function isValidObjectId(id) {
  if (!id) throw "Error: Please provide argument id";
  //if (typeof id !== "string") throw "Error:ID is not of string type.";
  if (typeof id === "string" && id.trim().length < 1) {
    throw "Error: ID is a blank string has been passed as argument";
  }
  if (!ObjectId.isValid(id))
    throw "Error: Provided ID is not valid argument (data)";
}
let exportedMethods = {
  async getProductsByUserId(id) {
    isValidObjectId(id);
    const productCollection = await products();
    let product = await productCollection.find({ devId: ObjectId(id) });
    product = await product.toArray();
    if (!product) throw "Error: No product found";
    return await product;
  },

  async getAllProducts() {
    const productCollection = await products();
    const prodList = await productCollection.find({}).toArray();
    const sorted = prodList.sort(prodList.likes);
    if (prodList.length === 0) throw "Error:No products in the database";
    return sorted;
  },

  async getProductById(product_Id) {
    isValidObjectId(product_Id);
    objId_product = ObjectId(product_Id);
    const prod_List = await products();
    const prodId = await prod_List.findOne({ _id: objId_product });
    if (prodId === null) throw "No product found";
    return prodId;
  },
  async addProduct(
    productName,
    description,
    websiteUrl,
    logo,
    tags,
    developer,
    devId
  ) {
    productName = productName.trim();
    websiteUrl = websiteUrl.trim();
    checkInputs(productName, description, websiteUrl, logo, tags, developer);
    isValidObjectId(devId);
    const verbiateURl = addhttp(websiteUrl);
    const productList = await products();
    let newProduct = {
      productName: productName,
      description: description,
      websiteUrl: verbiateURl,
      logo: logo,
      tags: tags,
      developer: developer,
      reviews: [],
      rating: 0.0,
      likes: 0,
      devId: devId,
    };
    const checkProd = await productList.findOne({
      productName: productName,
    });
    if (checkProd) {
      throw "Sorry! We already have a product with that name";
    }
    const insertProd = await productList.insertOne(newProduct);
    if (insertProd.insertedCount === 0)
      throw {
        message:
          "We are sorry. An error occured while adding the product. Please try again.",
        code: 500,
      };
    const dbId = await insertProd.insertedId;
    const addProduct = await this.getProductById(dbId.toString());
    return addProduct;
  },

  async getProductByProductName(textToSearch) {
    if (typeof textToSearch !== "string")
      throw "Error: The input is not a string";
    textToSearch = textToSearch.toLowerCase();
    const query = new RegExp(textToSearch, "i");
    const productCollection = await products();
    if (!productCollection) throw "Error: Empty DB";
    const productByName = await productCollection
      .find({
        productName: { $regex: query },
      })
      .toArray();
    if (productByName.length === 0)
      throw { message: "Error: No Matches", code: 500 };
    const sortedNameBylikes = productByName.sort(productByName.likes);
    return sortedNameBylikes;
  },

  //
  // This function will get a product by tag
  //
  async getProductbyTag(tagSearch) {
    if (typeof tagSearch !== "string") throw "Error: The input is not a string";
    tagSearch = tagSearch.toLowerCase();
    const query = new RegExp(tagSearch, "i");
    const productCollection = await products();
    const productByTag = await productCollection
      .find({
        tags: { $regex: query },
      })
      .toArray();
    if (productByTag.length === 0)
      throw { message: "Error: No Matches", code: 500 };
    const soredTagByLikes = productByTag.sort(productByTag.likes);
    return soredTagByLikes;
  },
  async updateCount(prodId, liked) {
    if (!prodId || !liked) throw "Error: Empty product_id & liked product";
    if (typeof prodId != "string") throw "prodId is not a string";
    if (typeof liked != "boolean") throw "liked is not a boolean value";
    if (prodId.trim().length < 1) throw "Product_id is blank";
    let objId = ObjectId(prodId);
    const productCollection = await products();
    const product = await productCollection.findOne({ _id: objId });
    let updated_like;
    if (product === null) throw "No Product with this ID";
    if (liked) {
      updated_like = parseInt(product.likes) + 1;
    } else {
      updated_like = parseInt(product.likes) - 1;
    }
    const updated_detials = { likes: updated_like };
    const updatedInfo = await productCollection.updateOne(
      { _id: objId },
      { $set: updated_detials }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update the product because it was not found in the database";
    }
  },

  //function to delete product from the database
  async deleteProduct(prodId) {
    isValidObjectId(prodId);
    prodId = ObjectId(prodId);
    const prodList = await products();
    const reviewList = await reviews();
    const prodCheck = prodList.findOne({ _id: prodId });
    if (!prodCheck) {
      throw "Error: Product to be deleted was not found in the database";
    }
    const delProd = prodList.deleteOne({ _id: prodId });
    if (delProd.deletedCount == 0) {
      throw `Product ${delProd.name} could not be deleted`;
    }
    return `Product ${delProd.name} has been deleted successfully`;
  },

  async updateProduct(
    updId,
    productName,
    description,
    websiteUrl,
    logo,
    tags,
    developer
  ) {
    isValidObjectId(updId);

    updId = ObjectId(updId);
    productName = productName.trim();
    websiteUrl = websiteUrl.trim();
    checkInputs(productName, description, websiteUrl, logo, tags, developer);
    const verbiateURl = addhttp(websiteUrl);
    const productList = await products();
    const checkProd = await productList.findOne({ _id: updId });
    if (!checkProd) {
      throw "Error: Product to be deleted was not found in the database";
    }
    let updProduct = {
      productName: productName,
      description: description,
      websiteUrl: verbiateURl,
      logo: logo,
      tags: tags,
      developer: developer,
    };
    const updProd = await productList.updateOne(
      { _id: updId },
      { $set: updProduct }
    );
    if (updProd.modifiedCount === 0) {
      throw "Error: We could not update the product. Please try again";
    }
    return "Successfully updated";
  },
};
module.exports = exportedMethods;
