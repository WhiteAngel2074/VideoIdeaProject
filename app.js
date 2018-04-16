const mongoose = require("mongoose");
//DB Config
const db = require("./config/db.js");
const express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
var methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
var bcrypt = require("bcryptjs");
const passport = require("passport");

// Connect to DEV_database OR PROD_DataBase
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// load helpers auth
const { ensureAuthentificated } = require("./helpers/auth");

// Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// passport config
require("./config/passport")(passport);

var index = require("./routes/index");
var users = require("./routes/users");
var ideas = require("./routes/ideas");

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// index route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

// uncomment after placing your favicon in /public

app.use(favicon(path.join(__dirname, "public", "h.ico")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/", index);
app.use("/users", users);
app.use("/ideas", ideas);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
