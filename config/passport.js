// define strategies
const LocalStrategy = require("passport-local");
var bcrypt = require("bcryptjs");
var User = require("../models/User");
const mongoose = require("mongoose");
const passport = require("passport");

module.exports = function(passport) {
  // serialize & desirealizee
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log(email);
      console.log(password);

      // Vérification du mot de passe

      User.findOne({ email: email }).then(user => {
        // si c pas le user
        if (!user) {
          return done(null, false, { message: "No User Found" });
        }

        // check password matches , il faut utiliser bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password Incorrect"
            });
          }
        });
      });
    })
  );
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
