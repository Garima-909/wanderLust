const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        //yhan pr hmne redirectUrl naam ki key bnai h session k andaar and originalUrl namm ki key pehle se hoti h req k andr
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;

    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing!");
        return res.redirect("/listings/" +id);
    }

    next();
};

module.exports.isAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;

    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You didn't create this review!");
        return res.redirect("/listings/" +id);
    }

    next();
};

module.exports.validateListing = (err , req, res, next) =>{
    console.log("-----------httt bc--------");
    console.log(req);
    let result;
    if (listingSchema){
        result = listingSchema.validate(req.body);
    }else{
        console.log("-------ERROR--------")
        return next(err);
    }

    if(result.error){
        // console.log("gola");
        let errMsg = result.error.details.map((el) => el.message).join(",");
        // throw new ExpressError(400, errror);
        console.log(result.error);

        throw new ExpressError(400, errMsg);
        // next(err);
    }
    else{
        next();
    }
};





