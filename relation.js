const mongoose = require('mongoose');

main()
.then((res)=>{
  console.log(res);
})
.catch((err)=>{
  console.log(err);
})
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/swiggy');
}
const user_schema = new mongoose.Schema({
    name: {
        type: String,
    },

    address: [
        {
            location: String,
            city: String
        }
    ]
});

const User = mongoose.model("User", user_schema);

const adduser = async () => {

    let user1 = new User({
        name: "prabhakar",

        address: [
            {
                location: "12th bridge satavwadi",
                city: "pune"
            }
        ]
    });

    user1.address.push({
        location: "10 bakery street",
        city: "london"
    });

    let result = await user1.save();

    console.log(result);
};

adduser();