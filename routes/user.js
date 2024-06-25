const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const {signupForm, signup, loginForm, login, logout} = require("../controllers/user.js");

//SIGNUP
router.route("/signup")
 .get( wrapAsync(signupForm))
 .post(wrapAsync(signup));


//LOGIN 
router.route("/login")
 .get( wrapAsync(loginForm))
 .post(
 saveRedirectUrl,   
 passport.authenticate("local", 
 {failureRedirect: "/login", 
 failureFlash: true}) , 
    wrapAsync(login));


//LOGOUT
router.get("/logout", logout);

module.exports = router;