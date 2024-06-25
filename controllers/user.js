const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{let {email, username, password } = req.body;
    console.log(email);
    console.log(username);
    console.log(password);
    let newUser = new User({email, username});

    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) =>{
        if(err){
            next(err);
        }
        req.flash("success", "User registered successfully!");
        res.redirect("/listings");

    })
    }
    catch(err){
        console.log(err);
    }

};

module.exports.loginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // console.log(req.user);

    let prevUrl = res.locals.redirectUrl || "/listings";
    res.redirect(prevUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    })
};

