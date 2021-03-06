var express       = require("express"),
    app                = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport         = require("passport"),
    cookieParser   = require("cookie-parser"),
    LocalStrategy  = require("passport-local"),
    flash                = require("connect-flash"),
    Trail                = require("./models/trail"),
    Comment        = require("./models/comment"),
    User               = require("./models/user"),
    session            = require("express-session"),
    seedDB           = require("./seeds"),
    methodOverride  = require("method-override");

    //requring routes
    var commentRoutes = require("./routes/comments"),
        trailRoutes  = require("./routes/trails"),
        indexRoutes   = require("./routes/index");
    
    mongoose.connect("mongodb://localhost/trailcamp");

    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride("_method"));
    app.use(cookieParser('secret'));

    app.locals.moment = require("moment");
    //seedDB(); //seed the database

    // PASSPORT CONFIG
    app.use(require("express-session")({
      secret: "Once again Rusty wins cutest dog!",
      resave: false,
      saveUninitialized: false
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

      app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });

    //Require Route Files
    app.use("/", indexRoutes);
    app.use("/trails", trailRoutes);
    app.use("/trails/:id/comments", commentRoutes);

    app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The Trail Camp Server has Started!");
});
