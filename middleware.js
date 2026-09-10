const listing = require("./model/listing");



module.exports.isLogin = (req, res, next) => {

    console.log("================================");
    console.log("URL:", req.originalUrl);
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Session:", req.session);
    console.log("================================");

    if (!req.isAuthenticated()) {
      req.session.redirectURL = req.originalUrl; // Store the original URL in the session  
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }

    next();
};

module.exports.redirectUrlmiddleware = (req, res, next) => {
    if (req.session.redirectURL) {
      res.locals.redirectURL = req.session.redirectURL; // Make it available in res.locals
    }
    next();
  };


  module.exports.isOwner = async (req, res, next) => {
     let { id } = req.params;

        let list=await listing.findById(id);
        if(!list.owner.equals(req.user._id)){
            req.flash("error","you dont have permission to edit this listing!");
            return res.redirect(`/listings/${id}`);
        }
        next();
      };

  