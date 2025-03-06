const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review =  require("../models/review.js");

//review Validation
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let erMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,erMsg);
    }else{
        next();
    }
};

//Reviews
//Post route
router.post("/",validateReview,wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new Review Saved.");
    req.flash("success", "Your Review Added!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId",wrapAsync(async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;