// define strategies
const LocalStrategy = require("passport-local");
var bcrypt = require("bcryptjs");
var User = require("../models/User");
const mongoose = require("mongoose");


module.exports = function (passport) {
    // serialize & desirealizee 
    passport.use(new LocalStrategy({usernameField : 'email'}, (email,password,done)=>{
        console.log(email);
        console.log(password);
        
    }))
}