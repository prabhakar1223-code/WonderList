// 

const mongoose = require("mongoose");
const listing = require("../model/listing.js");
const User = require("../model/user.js");
const initData = require("./data.js");

main()
    .then(() => {
        console.log("started connection");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlist");
}

const initDB = async () => {

    await listing.deleteMany({});

    const user = await User.findOne({ username: "akshay12" });

    if (!user) {
        console.log("User does not exist");
        return;
    }

    console.log("USER ID:", user._id);

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));

    await listing.insertMany(initData.data);

    console.log("data was inserted");
};

initDB();