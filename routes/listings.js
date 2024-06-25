const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const {index, createRoute, create, editRoute, edit, deleteRoute, showRoute} = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage });


//INDEX ROUTE
router.route("/")
 .get( wrapAsync(index))
 .post(isLoggedin, validateListing,upload.single('listing[image]'), wrapAsync(create));
 

//CREATE ROUTE
router.get("/new",isLoggedin, createRoute);

//UPDATE ROUTE
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(editRoute));

router.route("/:id")
 .put( isLoggedin, isOwner,upload.single('listing[image]'),validateListing, wrapAsync(edit))
 .delete(isLoggedin, isOwner, wrapAsync(deleteRoute))
 .get( wrapAsync(showRoute));

module.exports = router;



