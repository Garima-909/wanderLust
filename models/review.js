const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: String,
    ratings:{
        type: Number,
        min : 1,
        max: 5
    }, 
    createdAt: Date,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = reviewSchema;
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;