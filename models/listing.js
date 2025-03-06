const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title:{
        type : String,
        required: true,
    },
    description: String ,
    image:{
        type: String,
        default: "https://ultravilla-cdn-1.s3.eu-west-2.amazonaws.com/wp-content/uploads/2016/11/06110954/Carai%CC%81va-Villa-2-6.jpg",
        set:(v)=>
        v === ""
        ? "https://ultravilla-cdn-1.s3.eu-west-2.amazonaws.com/wp-content/uploads/2016/11/06110954/Carai%CC%81va-Villa-2-6.jpg" : v,
    },
    price:Number,
    location: String,
    country: String,
    reviews: [{
        type : mongoose.Types.ObjectId,
        ref: "Review",
    },
],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});




const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
