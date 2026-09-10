const express=require('express');
const app=express();
const session=require('express-session');
const Path =require('path');
const ejs=require('ejs');
const flash=require('connect-flash');
app.set("view engine", "ejs");

app.set("views", Path.join(__dirname, "views"));
let session_options={
secret:"secretcode",
resave:false,
saveUninitialized:true,
cookie:{
    expire:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
}
}
app.use(session(session_options));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    next();
})
// app.get("/home",(req,res,next)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you have visited the page ${req.session.count} times`);
// });
app.get("/register",(req,res,next)=>{
    let {name="not_No"}=req.query;
   req.session.name=name;
   req.flash("success","user registerd succesfully!");
   console.log(req.session)
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
        res.render("msg.ejs",{name:req.session.name,msg:req.flash("success")});
});
const PORT=3002;

app.listen(PORT,(req,res,next)=>{
    console.log(`server is runing on http://localhost:${PORT}`);
});