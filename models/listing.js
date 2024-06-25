const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },  
    description: String,
    image: {
        url: String,
        filename: String
        // type: String,
        // default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        // set: (v) => v === "" ? v = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60": v 
    }, 
    price: {
        type: Number,
        // required: true
    }, 
    location: String,
    country: String,
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

listingSchema.post('findOneAndDelete', async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.review}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;