const mongoCollection = require("../config/mongoCollection");
const {
  isValidUsername,
  isValidPassword,
  isValidString,
  isValidEmail,
  defaultNewUser,
  isValidObject,
  isValidPicture,
} = require("../utils");
const bcrypt = require("bcrypt");
const users = mongoCollection.users;

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
    const hash = await bcrypt.hash(password, 10);
    const user = await userCollection.insertOne({
      name,
      email,
      password: hash,
      ...defaultNewUser,
    });
    if (user.insertedCount === 0)
      throw { message: "Unable to add user", code: 500 };
    return { userInserted: true };
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
    console.log("passwordCorrect :>> ", passwordCorrect);
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
      console.log(`password`, password);
      isValidString(password, "password", 1);
      password = password.trim();
      isValidPassword(password);
    }
    photo && isValidString(photo, "photo", 1);
    // hash password before saving
    const hash = await bcrypt.hash(password, 10);
    const updatedUserData = {
      password: hash || user.password,
      photo: photo || user.photo,
      name: name || user.name,
    };

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
};