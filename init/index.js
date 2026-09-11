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

    const user = await User.findOne({
        username: "akshay12"
    });

    if (!user) {
        console.log("User does not exist");
        return;
    }

    console.log("USER ID:", user._id);

    const listings = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));

    await listing.insertMany(listings);

    console.log(`${listings.length} listings were inserted`);
};

initDB();