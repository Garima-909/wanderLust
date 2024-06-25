const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

//it automatically adds username and password fields to the schema 
//and it also perform the tasks of salting and hashing

module.exports = User;