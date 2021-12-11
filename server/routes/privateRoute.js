const express = require("express");
const multer = require("multer");
const { authMiddleware } = require("../middlewares/auth");
const { updateUser, getUser } = require("../data/users");
const router = express.Router();
const path = require("path");
const _ = require("lodash");
const {
  isValidPassword,
  isValidEmail,
  isValidUsername,
  isValidString,
  isValidObjectId,
} = require("../utils");
const reviews = require("../data/reviews");
const xss = require("xss");
const { getProductsByUserId } = require("../data/products");

// TODO: there's a middleware to check isadmin inside middleware/private.js
// we can use it for report user feature
router.get("/home", (req, res) => {
  res.render("homePage/homePage", {
    authenticated: true,
    user: req.session.user,
    title: "Home",
  });
});

router.get("/users/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = xss(id);
    id = id.trim();
    isValidObjectId(id);
    const userProducts = await getProductsByUserId(id);
    res.json({ products: userProducts });
  } catch (error) {
    console.log(error);
    return res.render("errorPage/404", {
      title: "Error",
      authenticated: req.session.user ? true : false,
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await getUser(req.session.user);
    const { nothingToUpdate, updateSuccessful } = req.session;
    const src = !_.isEmpty(user.photo)
      ? `/public/images/upload/${user.photo}`
      : "/public/images/guest-user.jpg";
    let toastMessage;
    if (updateSuccessful) {
      toastMessage = "Update successful";
    }
    if (nothingToUpdate) {
      toastMessage = "Nothing to update here";
    }
    const users = await getUser(req.session.user);
    const usernow = users._id;
    const review = await reviews.getReviewsByUser(usernow);
    let posts = [];
    let hasPost = false;
    for (let i = 0; i < review.length; i++) {
      posts.push(review[i]);
    }
    if (posts.length > 0) {
      hasPost = true;
    }

    res.render("profile/profile", {
      authenticated: true,
      user: req.session.user,
      userId: user._id,
      title: "Profile",
      src,
      name: user.name,
      email: user.email,
      nothingToUpdate,
      updateSuccessful,
      error: req.session.error,
      toastMessage,
      posts: posts,
      hasPost: hasPost,
    });
  } catch (error) {
    console.log(error);
    res.render("profile/profile", {
      authenticated: true,
      user: req.session.user,
      title: "Profile",
      error,
    });
  }
});

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/images/upload");
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

router.post(
  "/profile/update",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    if (req.session.user) {
      // user is authenticated so update the profile
      try {
        // first we get the user to get pre existing details so we dont need
        // to pass the whole user object
        const user = await getUser(req.session.user);
        //destructure the fields
        let { name = user.name, email = user.email, password } = req.body;
        name = xss(name);
        email = xss(email);
        password = xss(password);
        isValidString(name, "username");
        isValidString(email, "email");
        if (password.length > 0) {
          isValidString(password, "password");
          password = password.trim();
          isValidPassword(password);
        }
        name = name.toLowerCase().trim();
        email = email.toLowerCase().trim();
        isValidUsername(name);
        isValidEmail(email);

        let userDataToUpdate = {};
        userDataToUpdate.name = name;
        userDataToUpdate.email = req.session.user;
        userDataToUpdate.password = password;
        userDataToUpdate.photo = req.file?.filename;

        if (req.file && !req.file?.mimetype.includes("image")) {
          req.session.error = "Please upload an image";
          return res.redirect("/private/profile");
        }

        if (
          userDataToUpdate.name === user.name &&
          userDataToUpdate.email === user.email &&
          userDataToUpdate.password === "" &&
          (!userDataToUpdate.photo || userDataToUpdate.photo === user.photo)
        ) {
          req.session.nothingToUpdate = true;
          req.session.updateSuccessful = false;
          return res.redirect("/private/profile");
        }
        const updatedUser = await updateUser(userDataToUpdate);
        if (!updatedUser.updated) {
          return res.status(400).json({
            error: "An error occured could not update user",
          });
        } else {
          // res.render("profile/profile", {
          //   authenticated: true,
          //   successMessage: "Successfully updated user",
          // });
          req.session.updateSuccessful = true;
          req.session.nothingToUpdate = false;
          res.redirect("/private/profile");
        }
      } catch (error) {
        console.log(error);
        req.session.error = error;
        return res.redirect("/private/profile");
      }
    } else {
      res.redirect("/");
    }
  }
);

module.exports = router;
