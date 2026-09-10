const express=require('express');
const router=express.Router();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Path = require("path");
const listing = require("../model/listing.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsync");
const { isModuleNamespaceObject } = require('util/types');
const { isLogin,isOwner} = require("../middleware.js");
const listingController=require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudeConfig.js");

console.log("STORAGE FROM CONFIG:");
console.log(storage);

const upload = multer({ storage });
// app.use(express.static(Path.join(__dirname, "../public")));

// app.use(express.urlencoded({ extended: true }));

// app.use(methodOverride("_method"));


router.get("/", wrapAsync(listingController.index));

// ===============================
// Joi Validation Middleware
// ===============================

const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};



// ===============================
// NEW ROUTE
// ===============================

router.get("/new", isLogin, listingController.renderNewForm);

// ===============================
// CREATE ROUTE
// ===============================

// router.post(
//     "/",
//     validateListing,
//     wrapAsync(async (req, res) => {

//         console.log("POST /listings");

//         const list = new listing(req.body.listing);

//         console.log(list);

//         await list.save();

//         console.log("listing saved");
//        req.flash("success","New Listing Created Succesfully!");
//         res.redirect("/listings");

//     })
// );
//edited for image upload
router.post(
    "/",
    isLogin,
    validateListing,
    upload.single("image"),
    wrapAsync(listingController.createListing)
);

// ===============================
// EDIT ROUTE
// ===============================

router.get(
    "/:id/edit",isLogin,
    wrapAsync(listingController.renderEditForm)
);



// ===============================
// SHOW ROUTE
// ===============================

router.get(
    "/:id",
    wrapAsync(listingController.renderShowpage)
);


// ===============================
// UPDATE ROUTE
// ===============================

router.put(
    "/:id",isLogin,isOwner,
    upload.single("image"),
    // validateListing,
    wrapAsync(listingController.updateListing)
);
// ===============================
// REVIEW ROUTE
// ===============================
// router.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res,next)=>{
//     let {id}=req.params;
//     let list=await listing.findById(id);
//     let newReview=new review(req.body.review);
//     list.reviews.push(newReview);
//     await newReview.save();
//     await list.save();
//     console.log("New review saved");
//     res.redirect(`/listings/${id}`);
// })
// );
// ===============================
// DELETE ROUTE
// ===============================

router.delete(
    "/:id",isLogin,
    wrapAsync(listingController.deleteListing)
);

// /delete route for reviews

// router.delete("/listings/:id/:r_id/reviews",wrapAsync(async(req,res,next)=>{
//     let {id,r_id}=req.params;
//    let remove= await review.findByIdAndDelete(r_id);
//    console.log(remove);
//    res.redirect(`/listings/${id}`);


// }));


// ===============================
// Error Handling Middleware
// ===============================

router.use((err, req, res, next) => {

    console.log(err);

    res.status(500).send("Something went wrong");

});

module.exports=router;