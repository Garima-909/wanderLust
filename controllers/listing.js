const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    // console.log(allListings);

    res.render("listings/index.ejs", {allListings});
};

module.exports.createRoute = (req, res) => {   
    res.render("listings/new.ejs");
};

module.exports.create = async (req, res, next) => {

    //ya hm ise ese kr skte hn jese :
    //(pr iss case m name ki value normally aayegi)
    //let {title, description, image, price, location, country} = req.body

    //or ese b kr skte hn :
    //(or iske liye hmein name ki value ese likhni odegi jese likhi h)
    let listingg = req.body;
    console.log(listingg);
    console.log("gola comeback");
    let item = listingg.listing;
    console.log(item);
    console.log("gola returns");
    if(!item){
        throw new ExpressError(400, "invalid data sent!");
    }

    //observe the difference between item and listing

    // if(!item.price){
    //     throw new ExpressError(400, "price is missing!")
    // }
    // if(!item.location){
    //     throw new ExpressError(400, "location is missing!")
    // }
    // if(!item.country){
    //     throw new ExpressError(400, "country is missing!")
    // }
    //ya toh hm aise krein individual fields ko handle krne k liye jo ki bhot tidious taks hoga nd also NOT A GOOD PRACTISE ya hm joi use kr skte hn

    // validateListing();

    // console.log(Joi.object().validate());

    const newListing = new Listing(item);
    newListing.owner = req.user;
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
    console.log(newListing);
    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
    
};

module.exports.editRoute = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById({_id: id});
    console.log(listing);

    if(!listing){
        console.log("inside flash");
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    console.log(listing);

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.edit = async (req, res) => {
    let {id} = req.params;

    // console.log(req.body.listing);
    let listing = req.body.listing;

    if(!listing){
        console.log("----------------------------");
        throw new ExpressError(400, "invalid data is sent for listing!")
    }
    
    // console.log(listing);

    // await validateListing(req);

    let k = await Listing.findByIdAndUpdate({_id: id}, {...listing});
    //yhan pr listing object ko de-construct krna pdega i.e. ... se de-construct ho rha h
    // console.log(k);
    if(typeof req.file !== "undefined"){
        k.image.url = req.file.path;
        k.image.filename = req.file.filename;
    }
    
    await k.save();
    req.flash("success", "Updated Successfully!");

    res.redirect("/listings/" +id);

};

module.exports.deleteRoute = async (req, res) => {
    let {id} = req.params;

    await Listing.findByIdAndDelete({_id: id});

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

module.exports.showRoute = async (req, res) => {
    let {id} = req.params;
    console.log(id);

    let listing = await Listing.find({_id: id}).populate({path: "review", populate:{path: "author"}}).populate("owner");

    if(!listing[0]){
        console.log("inside flash");
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    console.log(listing[0]._id);
    console.log(listing[0].title);
    console.log(listing);

    res.render("listings/show.ejs", {listing});
};