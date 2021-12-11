const mongoCollection = require("../config/mongoCollection");
const {
  isValidUsername,
  isValidPassword,
  isValidString,
  isValidEmail,
  defaultNewUser,
  isValidObject,
  isValidPicture,
  saltRounds,
} = require("../utils");
const bcrypt = require("bcrypt");
const users = mongoCollection.users;
const { ObjectId } = require("mongodb");

module.exports = {
  async createUser(name, email, password) {
    isValidString(name, "username");
    isValidString(email, "email");
    isValidString(password, "password");
    name = name.toLowerCase().trim();
    email = email.toLowerCase().trim();
    password = password.trim();
    isValidUsername(name);
    isValidEmail(email);
    isValidPassword(password);
    const userCollection = await users();
    const userData = await userCollection.findOne({ email });
    if (userData) {
      throw "User already exists";
    }
    const hash = await bcrypt.hash(password, saltRounds);

    const user ={
      name,
      email,
      password: hash,
      ...defaultNewUser,
    };
    const insertInfo = await userCollection.insertOne(user);
    if (insertInfo.insertedCount === 0)
      throw { message: "Unable to add user", code: 500 };
    return { userInserted: true, user: user };
    
  },

  async checkUser(email, password) {
    isValidString(email, "email");
    isValidString(password, "password");
    email = email.toLowerCase().trim();
    password = password.trim();
    isValidEmail(email);
    isValidPassword(password);
    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw "Either the email or password is invalid";
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) throw "Either the email or password is invalid";
    return { authenticated: true, user };
  },

  async updateUser({ password, photo, name, email }) {
    // first check if user is there in the db
    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw "User does not exist";

    // get values for empty data
    name = name || user.name;
    email = email || user.email;
    photo = photo || user.photo;
    isValidString(name, "name", 1);
    isValidString(email, "email", 1);
    name = name.toLowerCase().trim();
    password = password.trim();
    email = email.toLowerCase().trim();
    isValidEmail(email);
    isValidUsername(name);
    if (password.length > 0) {
      isValidString(password, "password", 1);
      password = password.trim();
      isValidPassword(password);
    }
    photo && isValidString(photo, "photo", 1);
    // hash password before saving
    const hash = await bcrypt.hash(password, saltRounds);
    const updatedUserData = {
      password: password.length > 0 ? hash : user.password,
      photo: photo || user.photo,
      name: name || user.name,
    };

    // check if there's no change
    // if so then modified count will be 0
    // so instead of updating the user, we return the user
    if (
      updatedUserData.password === user.password &&
      updatedUserData.photo === user.photo &&
      updatedUserData.name === user.name
    ) {
      return { user, updated: true };
    }

    const updatedInfo = await userCollection.updateOne(
      { email: email },
      { $set: updatedUserData }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update the user data successfully";
    } else {
      const updatedUserFromDB = await userCollection.findOne({
        email: email,
      });
      return { updated: true, user: updatedUserFromDB };
    }
  },

  // get User from req.session
  async getUser(email) {
    isValidString(email, "email");
    email = email.toLowerCase().trim();
    isValidEmail(email);
    const userCollection = await users();
    const user = await userCollection.findOne({ email });
    if (!user) throw "User does not exist";
    return user;
  },
  async getUserById(id) {
    if (typeof id === "undefined") throw "id is not provided";
    if (typeof id != "string") throw "id is not a string";
    if (id.trim().length === 0) throw "id is an empty string";

    if (!ObjectId.isValid(id)) throw "id is not a valid objectId";

    let parsedId = ObjectId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: parsedId });
    if (user === null) throw "No User with that id is found.";

    return user;
  },
  async getReviewsByUserId(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    return user.reviews;
  },
  async getLikedProductsByUser(id) {
    const user = await this.getUserById(id);
    return user.likedProducts;
  },

  async checkLikedProduct(id, prodId) {
    const likedProd = await this.getLikedProductsByUser(id);
    if (!likedProd) return false;

    return likedProd.indexOf(prodId) > -1 ? true : false;
  },

  async updateLikedProducts(id, prodId) {
    let likedProducts = await this.getLikedProductsByUser(id);
    let flag = false;
    if (!likedProducts) {
      likedProducts = [prodId];
    } else {
      for (let i = 0; i < likedProducts.length; i++) {
        if (likedProducts[i] === prodId) {
          likedProducts.splice(i, 1);
          flag = true;
          break;
        }
      }
      if (!flag) likedProducts.push(prodId);
    }
    const user = await this.getUserById(id);

    const userCollection = await users();
    const updatedData = {
      likedProducts: likedProducts,
    };
    let parsedId = ObjectId(id);
    const updatedInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $set: updatedData }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw {
        message: "Could not update the user Liked Products successfully",
        code: 500,
      };
    }
    return flag;
  },
};
