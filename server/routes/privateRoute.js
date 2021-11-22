const express = require("express");
const multer = require("multer");
const { authMiddleware } = require("../middlewares/auth");
const { updateUser, getUser } = require("../data/users");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const btoa = require("btoa");
const {
  isValidPassword,
  isValidEmail,
  isValidUsername,
  isValidString,
} = require("../utils");

// TODO: there's a middleware to check isadmin inside middleware/private.js
// we can use it for report user feature
router.get("/home", (req, res) => {
  res.render("homePage/homePage", {
    authenticated: true,
    user: req.session.user,
    title: "Home",
  });
});

router.get("/profile", authMiddleware, async (req, res) => {
  const user = await getUser(req.session.user);
  console.log("user :>> ", user.name);
  //   const src = "data:image/gif;base64," + btoa(user.photo.data);
  const src = `/public/images/${user.photo}`;
  console.log(`src`, src);
  res.render("profile/profile", {
    authenticated: true,
    user: req.session.user,
    title: "Profile",
    src,
    name: user.name,
    email: user.email,
  });
});

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/images");
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
        console.log(`{name, email}`, { name, email });
        isValidString(name, "username");
        isValidString(email, "email");
        if (password.length > 0) {
          console.log("here");
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
        userDataToUpdate.photo = req.file.filename;

        console.log("userDataToUpdate :>> ", userDataToUpdate);
        const updatedUser = await updateUser(userDataToUpdate);
        if (!updatedUser.updated) {
          // TODO: display the error
          return res.status(400).json({});
        } else {
          res.render("profile/profile", {
            authenticated: true,
            successMessage: "Successfully updated user",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error,
        });
      }
    } else {
      res.redirect("/");
    }
  }
);

module.exports = router;
