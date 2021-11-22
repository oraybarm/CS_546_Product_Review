const userRoutes = require("./routes/usersRoute");
const privateRoutes = require("./routes/privateRoute");
const homePageRoute = require("./routes/homePageRoute");

const constructorMethod = (app) => {
  // Landing page '/' route
  app.use("/", homePageRoute);
  app.use("/users", userRoutes);
  app.use("/private", privateRoutes);
  app.get("/*", (req, res) => {
    res.render("errorPage/404");
  });
};

module.exports = constructorMethod;
