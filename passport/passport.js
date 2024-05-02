require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Users = require('../db/db').Users;

const validPassword  = require('../utils/passwordUtils').validPassword;
const LCverifyCallback = (username, password, done)=>{
    Users.findOne({ where: {username:username}})
    .then((user)=>{
        if(!user){return done(null,false)}

        const isValid = validPassword(password,user.hash,user.salt);
        if(isValid){
            return done(null,user);
        }else{
            return done(null,false);
        }
      })
      .catch((err) =>{
        done(err);
      })
}
const LCstrategy = new LocalStrategy(LCverifyCallback);

const FBsetUp = {
    clientID: process.env.FB_CLIENT_ID,
    clientSecret:  process.env.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    state: true,
    profileFields: ['id', 'emails', 'name']
    // scope: ['email'] 
    }
const FBverifyCallback = (accessToken, refreshToken, profile, cb)=>{
  profile.email = '123@123';// เพิ่ม test email เพราะ fb ไม่คือค่า email มาให้
    return cb(null,profile)
}
const FBstrategy = new FacebookStrategy(FBsetUp,FBverifyCallback);

const GGsetup = {
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback   : true
}
GGverifyCallback = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
const GGstrategy = new GoogleStrategy(GGsetup,GGverifyCallback);

passport.use(LCstrategy);
passport.use(FBstrategy);
passport.use(GGstrategy);
passport.serializeUser((user,done)=>{
    done(null, user.email);
  });
  
  passport.deserializeUser((userEmail,done)=>{
    Users.findOne({where:{
      email: userEmail
    }}).then((user)=>{
      done(null, user);
    }).catch(err =>done(err))
  });