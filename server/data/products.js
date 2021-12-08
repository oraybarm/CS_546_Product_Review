const mongoCollections = require("../config/mongoCollection");
const products = mongoCollections.products;
let { ObjectId } = require("mongodb");
const { isValidObject } = require("../utils.js");

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
    /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[‌​a-z]{3}\.([a-z]+)?$/gm;
  if (!re.test(websiteUrl)) {
    return res.status(400).json({
      error: "Website URL provided does not satisfy proper criteria (route)",
    });
  }
  console.log("tag", tags);
  if (!Array.isArray(tags) || tags.length === 0)
    throw "Error: Tag is not of string type or tag field is empty";

  for (let i = 0; i < tags.length; i++) {
    if (tags[i].trim().length < 1 || typeof tags[i] !== "string")
      throw "Error: Tag is not of string type or tag field is empty";
  }
  // parsedTags.forEach((tag) => {
  //   isValidObject(tag);
  //   if (typeof tag.name !== "string" || tag.name.trim().length < 1) {
  //     throw "Error: Tag is not of string type or tag field is empty";
  //   }
  // });
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
  async getAllProducts() {
    const productCollection = await products();
    const prodList = await productCollection.find({}).toArray();
    const sorted = prodList.sort(prodList.likes);
    if (prodList.length === 0) throw "Error:No products in the database";
    //console.log("get all test");
    //console.log(sorted);
    return sorted;
  },

  //Obtains product details using ID
  async getProductById(product_Id) {
    checkID(product_Id);
    objId_product = ObjectId(product_Id);
    const prod_List = await products();
    const prodId = await prod_List.findOne({ _id: objId_product });
    if (prodId === null) throw "No product found";
    return prodId;
  },
  //addProduct method

  async addProduct(
    productName,
    description,
    websiteUrl,
    logo,
    tags,
    developer
  ) {
    productName = productName.trim();
    websiteUrl = websiteUrl.trim();
    checkInputs(productName, description, websiteUrl, logo, tags, developer);
    console.log(tags);
    const productList = await products();
    let newProduct = {
      productName: productName,
      description: description,
      websiteUrl: websiteUrl,
      logo: logo,
      tags: tags,
      developer: developer,
      reviews: [],
      rating: 0.0,
      likes: 0,
    };
    const checkProd = await productList.findOne({
      productName: productName,
    });
    if (checkProd) {
      throw "Sorry! We already have a product with that name";
    }
    const insertProd = await productList.insertOne(newProduct);
    if (insertProd.insertedCount === 0)
      throw "We are sorry. An error occured while adding the product. Please try again.";
    const dbId = await insertProd.insertedId;
    //console.log(typeof dbId);
    const addProduct = await this.getProductById(dbId.toString());
    //console.log(typeof addRest);
    return addProduct;
  },

  //
  // This function will get a product by name search

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
    //console.log(productByName);
    if (productByName.length === 0) throw "Error: No Matches";
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
    if (productByTag.length === 0) throw "Error: No Matches";
    const soredTagByLikes = productByTag.sort(productByTag.likes);
    return soredTagByLikes;
  },
};
module.exports = exportedMethods;
