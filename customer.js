const mongoose = require('mongoose');
const { schema, findOneAndDelete } = require('./model/listing');

main()
.then((res)=>{
  console.log(res);
})
.catch((err)=>{
  console.log(err);
})
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/customer_store');
}
const order_schema = new mongoose.Schema({
   item:String,
   price:Number
});

const customer_schema=new mongoose.Schema({
  name:String,
  orders:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Order"
    }
  ]
});
customer_schema.post("findOneAndDelete",async(customer)=>{
    if(customer.orders.length){
      let res=await Order.deleteMany({_id:{$in:customer.orders}});
      console.log(res);
    }
});

const Customer= mongoose.model("Customer",customer_schema);
const Order=mongoose.model("Order",order_schema);



const addOrder=async()=>{
  let insert=await Order.insertMany([
  {item:"Milk",price:232},{item:"shugar",price:70},{item:"dal",price:90}
  ]);
  console.log(insert);

}
// addOrder();
const customerAdd=async()=>{
    let cust1=new Customer({
      name:"Prabhakar shinde",
      
    });

    let ord1=await Order.find({item:"Milk"});
     let ord2=await Order.find({item:"dal"});
     cust1.orders.push(ord1[0]._id);
     cust1.orders.push(ord2[0]._id);
    // console.log(ord1);
    // console.log(ord2);
   let result= await cust1.save();
   console.log(result);
  //  let log=await Customer.find();
  //  console.log(log);
  };
// addOrder();


// customerAdd();


const newAdd=async()=>{
  let cust1=new Customer({
      name:"Prabhakar shinde"
  });
  let ord1=new Order({
    item:"rice",
    price:50
  });
  let ord2=new Order({
    item:"corn",
    price:100
  });
  cust1.orders.push(ord1);
  cust1.orders.push(ord2);
  await ord1.save();
  await ord2.save();
  await cust1.save();
  console.log("added");
  
};

const del_order=async()=>{
  let data=await Customer.findByIdAndDelete("6a9523c5ef5a1eb5da211c80");
  console.log(data);
}
// newAdd();
del_order();