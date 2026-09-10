const express = require("express");
const router = express.Router();

const User = require("../model/user.js");
const passport = require("passport");
const { redirectUrlmiddleware } = require("../middleware.js");
const userController = require("../controllers/user.js");
router.get("/signup", userController.renderSignupForm);

router.post("/signup", userController.signupHandle);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
    "/login",
    redirectUrlmiddleware, // Use the redirectUrlmiddleware here
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
   userController.loginHandle
);
// router.get("/logout", (req, res,next) => {

//   req.logout((err)=>{
//     if(err){
//       return next(err);
//     }
//     req.flash("success","you log out successfully!");
//     res.redirect("/login");
//   });
// });


router.get("/logout", userController.logoutHandle);


module.exports = router;