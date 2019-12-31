const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/User");
require("dotenv").config();

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PrivateKey;
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload);
    
    User.findById(jwt_payload.id)
        .then(user=>{
          if(user){
            return done(null,user);
          }else{
            return done(null.false);
          }
        })
        .catch(err => console.log(err));
}));


module.exports = passport; 