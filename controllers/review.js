const review = require("../model/review.js");
const listing = require("../model/listing.js");
module.exports.deleteReview = async(req,res,next)=>{
    let {id,r_id}=req.params;
    let reviewToDelete = await review.findById(r_id);
    if(!reviewToDelete){
        req.flash("error","Review not found!");
        return res.redirect(`/listings/${id}`);
    }


    if(!reviewToDelete.author.equals(req.user._id)){
        req.flash("error","You dont have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
   let remove= await review.findByIdAndDelete(r_id);
   console.log(remove);
    req.flash("success","Review Deleted!");
   res.redirect(`/listings/${id}`);


}

module.exports.createReview = async (req, res) => {

        let { id } = req.params;

        let list = await listing.findById(id);
        // Set the author of the listing to the current user
        // Check if listing exists
        if (!list) {
            return res.status(404).send("Listing not found");
        }

        let newReview = new review(req.body.review);
        newReview.author = req.user._id;
        list.reviews.push(newReview);
       
        await newReview.save();
        await list.save();

        console.log("New review saved");
         req.flash("success"," New Review created!");
        res.redirect(`/listings/${id}`);
    }