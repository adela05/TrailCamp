var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
  res.render("landing");
});

//===========================
// AUTH ROUTES
//===========================

//show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.avatar
    });
      User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register", {error: err.message});
        }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Successfully Signed Up! Nice to meet you" + req.body.username);
        res.redirect("/trails");
      });
    });
});

//show login form
router.get("/login", function(req, res) {
   res.render("login", {page: 'login'});
});
//handling login logic
router.post("/login", passport.authenticate("local",
    {successRedirect: "/trails",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: 'Welcome to Trail Camp!'
    }), function(req,res){
});

// logic route for logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/trails");
});


module.exports = router;
