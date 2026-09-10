const User = require("../model/user.js");
const passport = require("passport");
const { redirectUrlmiddleware } = require("../middleware.js");
const userController = require("../controllers/user.js");
const flash=require('connect-flash');
module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup");
}


module.exports.signupHandle = async(req, res, next) => {
  try {
    let { username, email, password } = req.body;

    let user = new User({
      username,
      email
    });

    let registeredUser = await User.register(user, password);

    console.log(registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }else
         req.flash("success", "Successfully signed up");
      return res.redirect("/listings");
    });

    req.flash("success", "Successfully signed up");
    res.redirect("/listings");

  } catch (e) {
    console.log("SIGNUP ERROR:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.loginHandle= async (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect(res.locals.redirectURL || "/listings");
    }

module.exports.logoutHandle =(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logged out successfully!");
        res.redirect("/login");
    });
}