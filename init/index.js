const mongoose = require("mongoose");

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("connected to DB successfully!");
}).catch((err) => {
    console.log(err);
});

const Listing = require("../models/listing.js");
const initData = require("./data.js");

const initDB = async() =>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "657fc1807fa0b69f94e52e0f"}));
    await Listing.insertMany(initData.data)
    console.log("data saved successfully");

}

initDB();
