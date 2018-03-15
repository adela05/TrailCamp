var express = require("express");
var router = express.Router({mergeParams: true});
var Trail = require("../models/trail");
var Comment = require("../models/comment");
var middleware    = require("../middleware");
var { isLoggedIn, checkUserComment, isAdmin } = middleware;


//================================
//  COMMENTS ROUTES
//================================
//Comment New
router.get("/new", isLoggedIn, function(req, res){
  //find trail by id
  console.log(req.params.id);
  Trail.findById(req.params.id, function(err, trail){
    if(err){
    console.log(err);
  } else {
    res.render("comments/new", {trail: trail});
  }
  });
});
//Comment Create
router.post("/", isLoggedIn, function(req, res){
  //lookup trail using ID
  Trail.findById(req.params.id, function(err, trail){
    if(err){
      console.log(err);
      res.redirect("/trails");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect new comment to trail
          trail.comments.push(comment);
          trail.save();
          console.log(comment);
          req.flash("success", "Successfully added comment.");
          //redirect trail to show page
          res.redirect('/trails/' + trail._id);
        }
      });
    }
  });
});
//Comment Edit Route
router.get("/:comment_id/edit", isLoggedIn, checkUserComment, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment) {
     if (err){
       res.redirect("back");
     } else {
       res.render("comments/edit", {trail_id: req.params.id, comment:foundComment});
     }
  });
});

//COMMENT Destroy route
router.delete("/:comment_id", isLoggedIn, checkUserComment, function(req, res){
  //find by ID and Remove
  Trail.findByIdAndUpdate(req.params.id, {
    $pull:{
      comments: req.comment.id}
    }, function(err){
    if(err){
      console.log(err)
      req.flash('error', err.message);
      res.redirect("back");
    } else{
      req.flash("error", "Comment deleted.");
      res.redirect("/trails/" + req.params.id);
    }
  });
});


module.exports = router;
