exports.authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(403).render("error", {
      error: "user is not logged in",
      title: "Error",
    });
  }
};
