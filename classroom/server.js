const express= require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");




app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
const sessionOptions = {secret: "mysupersecretstring", resave: false, saveUninitialized: true};
app.use(session(sessionOptions));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
   if(req.session.name === "anonymous"){
    req.flash("error", " user not registered")
   }else{
    req.flash("success","your registered.");
   }
    
    res.redirect("/hello");
});

app.get("/hello",(req, res)=>{
    res.locals.successMsg= req.flash("success");
    res.locals.errorMsg = req.flash("error");

    res.render("hello.ejs",{name: req.session.name});
});

// app.get("/countCheck",(req, res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
    
//     res.send(`total count is ${req.session.count}`);
// });

app.listen(8080,()=>{
    console.log("server is running on port 8080");
});