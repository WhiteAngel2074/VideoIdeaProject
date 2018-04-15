var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var passport = require("passport");
/* GET users listing. */
router.get("/login", function(req, res, next) {
  res.render("users/login");
});

// Login Form Post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout User
router.get("/logout", function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out')
  res.redirect("/users/login");
});

router.get("/register", function(req, res, next) {
  res.render("users/register");
});

router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters " });
  }
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Password do not match " });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registred");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;
