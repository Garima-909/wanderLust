const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.reviewRoute = async (req, res) => {
    let {id} = req.params;
    let review = req.body.review;
    let newReview = new Review(review);
    console.log(newReview);
    newReview.createdAt = Date.now();
    newReview.author = req.user._id;
    console.log(newReview);

    let listing = await Listing.findOne({_id: id});
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("data saved");
    console.log("review saved");

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("review deleted successfully");

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}