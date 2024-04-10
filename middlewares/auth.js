const Event = require("../models/event");
// const { isValidated } = require("./validator");

//check if user is a guest
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    req.flash("error", "you are logged in already");
    return res.redirect("/users/profile");
  }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    req.flash("error", "you need to log in first");
    return res.redirect("/users/login");
  }
};

//check if user is author of the story
exports.isAuthor = (req, res, next) => {
  let id = req.params.id;
  // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //     let err = new Error('Invalid story id');
  //     err.status = 400;
  //     return next(err);
  // }
  Event.findById(id)
    .then((event) => {
      if (event) {
        if (event.author == req.session.user) {
          return next();
        } else {
          let err = new Error("Unauthorized to access the resource");
          err.status = 401;
          return next(err);
        }
      } else {
        let err = new Error("event cannot be found");
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
};
