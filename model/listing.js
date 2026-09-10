const mongoose = require("mongoose");
const Review=require('./review.js');

const list_schema = new mongoose.Schema({
    title: {
        type: String
    },

    description: {
        type: String
    },

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },

        url: {
            type: String,
            default: "https://images.pexels.com/photos/31256342/pexels-photo-31256342.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31256342.jpg&fm=jpg"
        }
    },

    price: {
        type: Number
    },

    location: {
        type: String
    },

    country: {
        type: String
    },
    reviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
        
    }
],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
});

const listing = mongoose.model("listing", list_schema);

module.exports = listing;