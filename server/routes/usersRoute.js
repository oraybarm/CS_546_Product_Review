const express = require("express");
const users = require("../data/users");
const {
  isValidString,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} = require("../utils");
const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("here in /");
  if (req.session.user) {
    res.redirect("/private");
  } else {
    res.render("auth/login", {
      authenticated: false,
      title: "Login",
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("auth/login", {
      authenticated: false,
      title: "Login",
    });
  }
});

router.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("auth/login", {
      authenticated: false,
      title: "Signup",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log("{name, email, password} :>> ", { name, email, password });
    isValidString(name, "name");
    isValidString(email, "email");
    isValidString(password, "password");
    email = email.toLowerCase().trim();
    password = password.trim();
    isValidUsername(name);
    isValidEmail(email);
    isValidPassword(password);
    const newUser = await users.createUser(name, email, password);
    if (!newUser.userInserted) {
      throw { message: "Unable to add user", code: 500 };
    }
    req.session.user = email;
    req.session.isAdmin = newUser.isAdmin;
    res.redirect("/");
  } catch (error) {
    console.log("error :>> ", error);
    if (error.code === 500) {
      return res.status(error.code).render("auth/login", {
        authenticated: false,
        error: error,
        status: 500,
        title: "Signup",
      });
    }
    return res.status(400).render("auth/login", {
      authenticated: false,
      error: error,
      status: 400,
      title: "Signup",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    isValidString(email, "email");
    isValidString(password, "password");
    email = email.toLowerCase().trim();
    password = password.trim();
    isValidEmail(email);
    isValidPassword(password);
    const user = await users.checkUser(email, password);

    if (!user.authenticated) {
      throw { message: "Unable to login this user", code: 500 };
    }
    req.session.user = email;
    req.session.isAdmin = user.isAdmin;

    res.redirect("/home");
  } catch (error) {
    if (error.code === 500) {
      return res.status(error.code).render("auth/login", {
        authenticated: false,
        error: error.message,
        status: 500,
        title: "Login",
      });
    }
    return res.status(400).render("auth/login", {
      authenticated: false,
      error: error,
      status: 400,
      title: "Login",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// FIXME: send a 404 page here
// router.get("*", authMiddleware, (req, res) => {
//   console.log("here in *");
//   if (req.session.user) {
//     res.redirect("/private");
//   } else {
//     res.status(403).render("error", {
//       error: "user is not logged in",
//       title: "Error",
//     });
//   }
// });

module.exports = router;
