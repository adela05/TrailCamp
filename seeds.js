var mongoose = require("mongoose");
var Trail  = require("./models/trail");
var Comment = require("./models/comment");

var data =  [
  {
    name: "Cloud's Rest",
    image: "https://images.unsplash.com/photo-1496605692486-092c3480f3a5?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&dl=john-gibbons-277085-unsplash.jpg&s=52b58b3d6d0843277df2a48ba425c25f",
    description: "A beautiful view of the clouds."
  },
  {
    name: "Trees Rest",
    image: "https://images.unsplash.com/photo-1420582282039-a6d11404cb66?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&dl=charles-black-5255-unsplash.jpg&s=6cb97c157a9d2fb232d588afce2a0670",
    description: "A beautiful view of the trees."
  }
  ];

function seedDB(){
  //Remove all Trails
  Trail.remove({}, function(err){
    if(err){
      console.log(err);
    }
      console.log("removed trails");
      Comment.remove({}, function(err){
        if(err){
          console.log(err);
        }
        console.log("removed comments");

      //add a few campgrounds
      data.forEach(function (seed){
        Trail.create(seed, function(err, trail){
          if(err){
            console.log(err);
            } else {
                console.log("added a trail");
                //Create a comment
                Comment.create({
                  text: "This place is great.",
                  author: "Homer"
                }, function(err, comment){
                  if (err){
                    console.log(err);
                  } else{
                      trail.comments.push(comment._id);
                      trail.save();
                      console.log("Created new comment");
                      }
                });
            }
          });
        });
      });
   });
  //add a few comments
}

module.exports = seedDB;
