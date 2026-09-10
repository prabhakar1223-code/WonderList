if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listing = require("./model/listing.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const review = require("./model/review.js");
const wrapAsync = require("./utils/wrapAsync");
const listingRouters=require('./routes/listing.js');
const reviewRouters=require('./routes/review.js');
const userRoutes=require('./routes/user.js');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./model/user.js');
let session_options={
    secret:"secretcode",
    resave:false,
    saveUninitialized:true
}



// ===============================
// MongoDB Connection
// ===============================

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlist");
}


// ===============================
// App Configuration
// ===============================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", Path.join(__dirname, "views"));


// ===============================
// Middleware
// ===============================

app.use(express.static(Path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));


// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.send("Hi working fine bro");
});

app.use(session(session_options));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});


// ===============================
// API Middleware
// ===============================

app.use("/api", (req, res, next) => {

    let { token } = req.query;

    if (token === "give") {
        return next();
    }

    res.send("Access Denied");
});


// API Route

app.get("/api", (req, res) => {
    res.send("<h1>api is working</h1>");
});

app.get("/demo_user", async (req, res) => {

    const user = new User({ email: "akshay12@gmail.com",
        username: "akshay12" });
        
    const registeredUser = await User.register(user, "akshay12");

    res.send(registeredUser);
});


app.use("/listings",listingRouters);
app.use("/listings",reviewRouters);
app.use("/",userRoutes);


// // ===============================
// // Joi Validation Middleware
// // ===============================

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


// // ===============================
// // INDEX ROUTE
// // ===============================

// app.get("/listings", wrapAsync(async (req, res) => {

//     const allList = await listing.find();

//     console.log("all listings");

//     res.render("listings/index.ejs", { allList });

// }));


// // ===============================
// // NEW ROUTE
// // ===============================

// app.get("/listings/new", (req, res) => {

//     console.log("New Get route working");

//     res.render("listings/new.ejs");

// });


// // ===============================
// // CREATE ROUTE
// // ===============================

// app.post(
//     "/listings",
//     validateListing,
//     wrapAsync(async (req, res) => {

//         console.log("POST /listings");

//         const list = new listing(req.body.listing);

//         console.log(list);

//         await list.save();

//         console.log("listing saved");

//         res.redirect("/listings");

//     })
// );


// // ===============================
// // EDIT ROUTE
// // ===============================

// app.get(
//     "/listings/:id/edit",
//     wrapAsync(async (req, res) => {

//         console.log("working edit route");

//         let { id } = req.params;

//         const list = await listing.findById(id);

//         res.render("listings/edit.ejs", { list });

//     })
// );


// // ===============================
// // SHOW ROUTE
// // ===============================

// app.get(
//     "/listings/:id",
//     wrapAsync(async (req, res) => {

//         let { id } = req.params;

//         const home = await listing.findById(id).populate("reviews");

//         res.render("listings/show.ejs", { home });

//     })
// );


// // ===============================
// // UPDATE ROUTE
// // ===============================

// app.put(
//     "/listings/:id",
//     validateListing,
//     wrapAsync(async (req, res) => {

//         let { id } = req.params;

//         await listing.findByIdAndUpdate(
//             id,
//             { ...req.body.listing }
//         );

//         res.redirect(`/listings/${id}`);

//     })
// );
// // ===============================
// // REVIEW ROUTE
// // ===============================
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res,next)=>{
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
// // ===============================
// // DELETE ROUTE
// // ===============================

// app.delete(
//     "/listings/:id",
//     wrapAsync(async (req, res) => {

//         let { id } = req.params;

//         let list = await listing.findByIdAndDelete(id);

//         console.log(list);

//         res.redirect("/listings");

//     })
// );

// // /delete route for reviews

// app.delete("/listings/:id/:r_id/reviews",wrapAsync(async(req,res,next)=>{
//     let {id,r_id}=req.params;
//    let remove= await review.findByIdAndDelete(r_id);
//    console.log(remove);
//    res.redirect(`/listings/${id}`);


// }));


// // ===============================
// // Error Handling Middleware
// // ===============================

app.use((err, req, res, next) => {

    console.log(err);

    res.status(500).send("Something went wrong");

});


// ===============================
// Server
// ===============================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/listings`);
});