const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const reviewSchema = require("../schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedin, isAuthor} = require("../middleware.js");
const {reviewRoute, deleteReview} = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    console.log(req.body);

    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        // throw new ExpressError(400, errror);
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};


//REVIEW ROUTE
router.post("/",validateReview, isLoggedin, wrapAsync(reviewRoute));

//REVIEW DELETE ROUTE
router.delete("/:reviewId", isLoggedin,isAuthor, wrapAsync(deleteReview));

module.exports = router;