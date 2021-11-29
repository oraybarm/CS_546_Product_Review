const userRoutes = require("./usersRoute");
const productRoutes = require("./productRoute");
const reviewRoutes=require('./reviewsRoute');
const constructorMethod = (app) => {
  // Landing page '/' route
  app.use("/", userRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
  app.use("/product", productRoutes);
  app.use('/reviews',reviewRoutes);
};

module.exports = constructorMethod;
