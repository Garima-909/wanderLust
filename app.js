if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

async function main()
{
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("connected to DB successfully!");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log("server is listening for requests");
});

const sessionOptions = {
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
//a middleware that initializees passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//it means that any user browsing our website  must be authenticated through localStrategy using the function authenticate()
//this method is added by passport-local-mongoose
//authenticate means use ko login and signup krwana
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// use static serialize and deserialize of model for passport session support
//serialize means to store user's info during a session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/", (req, res) => {
//     res.send("i am working");
// });

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student2@gmail.com",
//         username: "deltaStudent2"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     //here helloworld is the password 
//     //register() fn also checks automatically if the username is unique or not and save it in the db
//     console.log(registeredUser);
//     res.send(registeredUser);
// });

// app.get("/test", (req, res) => {
//     let listing1 = new Listing({
//         title: "My Villa",
//         description: "Sea Facing",
//         price: 12000,
//         location: "Mumbai",
//         country: "India"
//     });
//     listing1.save().then(()=>{
//         console.log("data saved successfully!");
//     }).catch((err) => {console.log(err)});

//     res.send("hii");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);




// app.all("*", (req, res) => {
//     throw new ExpressError(400, "Page Not Found");
// });


// app.use((err, req, res, next) => {
//     res.send("Something went wrong");
// });

app.use((err, req, res, next) => {
    let {status = 500, message  = "Some error occured!"} = err;
    // res.status(status).send(message);
    console.log(err.stack);
    res.render("error.ejs", {status, message});
    
});


