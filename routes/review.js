const express=require('express');
const router=express.Router();
const { listingSchema,reviewSchema } = require("../schema.js");
const review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsync");
const listing = require("../model/listing.js");
const methodOverride = require("method-override");
const { isLogin } = require("../middleware.js");
const reviewController=require("../controllers/review.js");
const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};
// ===============================
// REVIEW ROUTE
// ===============================
router.post(
    "/:id/reviews",
    isLogin,
    validateReview,
    wrapAsync(reviewController.createReview)
);


router.delete("/:id/:r_id/reviews",isLogin,wrapAsync(reviewController.deleteReview));

module.exports=router;