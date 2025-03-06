const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


//Get route
router.get("/signup",(req, res)=>{
    res.render("users/signup.ejs");
});


//Post Route SignUp
router.post("/signup",wrapAsync(async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({
            email,username
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})
);


//get Route for Login
router.get("/login",(req, res)=>{
    res.render("users/login.ejs");
});

//POST Route for Login
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),async(req,res)=>{
    req.flash("success","Welcome to Wonder lust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//Get Route for LogOut
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
});
module.exports = router;