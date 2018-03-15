var Comment = require("../models/comment");
var Trail = require("../models/trail");
module.exports = {
  isLoggedIn: function(req,res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error', 'You must be signed in to do that!');
    res.redirect('/login');
  },
  checkUserTrail: function(req,res, next){
    Trail.findById(req.params.id, function(err, foundTrail){
      if(err || !foundTrail){
        console.log(err);
        req.flash('error', 'Sorry, that trail does not exits!');
        res.redirect('/trails');
      }else if (foundTrail.author.id.equals(req.user._id) || req.user.isAdmin){
        req.trail = foundTrail;
        next();

      }else{
        req.flash('error', "You don/'t have permission to do that!");
        res.redirect('/trails/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(re.params.commentId, function(err, foundComment){
      if(err || !foundComment){
        console.log(err);
        req.flash('error', "Sorry, that comment does not exist!");
        res.redirect('/trails');
      }else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
        req.comment = foundComment;
        next();
      }else{
        req.flash('error', "You don\'t have the permission to do that!");
        res.redirect('/trails/' + req.params.id);
      }
    });
  },
  isSafe: function(req, res, next) {
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
  }
},
