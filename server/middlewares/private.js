export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.isAdmin) {
    next();
  } else {
    res.status(403).render("error", {
      error: "user is not logged in",
      title: "Error",
      authenticated: false,
      partial: "errors-script",
    });
  }
};
