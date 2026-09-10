const mongoose=require('mongoose');

main()
.then((res)=>{
  console.log(res);
})
.catch((err)=>{
  console.log(err);
})
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/post');
}


const user_schema=new mongoose.Schema({
    name:String,
    email:String
});
const Post_schema=new mongoose.Schema({
    content:String,
    like:Number,
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
    
});

const User=mongoose.model("User",user_schema);
const Post=mongoose.model("Post",Post_schema);

const addUser=async()=>{
    let res=await User.insertOne(
      {
        name:"Prabhakar",
        email:"shinde3562@gmail.com"
      }
    );

    console.log(res);
    
    let post1=new Post({
      content:"MY country is my love",
      like:7

    });
    const p1=await User.find();
    post1.user=p1[0]._id;

    let post2=new Post({
      content:"India is my country",
      like:9

    });
    const p2=await User.find();
    post2.user=p2[0]._id;
    await post1.save();
    await post2.save();


    console.log(post1);
    console.log(post2);
  }

addUser();

// const delete_col=async()=>{
//   await User.deleteMany({});
//   await Post.deleteMany({});
// };

// delete_col();