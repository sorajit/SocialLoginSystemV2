const router = require("express").Router();
const path = require("path");
const htmlPath = path.join(__dirname, "../public");
const passport = require("passport");
const { json } = require("sequelize");
const Users = require("../db/db").Users;
const genPassword = require("../utils/passwordUtils").genPassword;
const emailVerify = require('../utils/emailUtils').emailVerify;

//----------------- Register----------------------------//
router.post("/register", (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  Users.create({
    username: req.body.username,
    email: req.body.email,
    hash: hash,
    salt: salt,
  }).then((user) => {
    console.log(user);
  });
  res.redirect("/login");
});
//----------------- Local login section -----------------//
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

//----------------- FB login section -----------------//
router.get("/auth/facebook", passport.authenticate("facebook"));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {failureRedirect:'/login-failure', successRedirect:'/login-success'}));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req, res) => { 
    url = await emailVerify(req.user.email); //ตรวจสอบว่ามี email อยู่ในฐานข้อมูลหรือไม่ ถ้าไม่มีให้ไป register
    res.redirect(url);
  }
);
//------------------ End FB login section----------------------------//

// --------------- GG login section ---------------------------------//
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async(req, res) => {
    url = await emailVerify(req.user.email);//ตรวจสอบว่ามี email อยู่ในฐานข้อมูลหรือไม่ ถ้าไม่มีให้ไป register
    res.redirect(url);
  }
);
//------------------ End GG login section----------------------------//
router.get("/", (req, res, next) => {
  res.sendFile(htmlPath + "/index.html");
});
router.get("/register", (req, res, next) => {
  res.sendFile(htmlPath + "/register.html");
});
router.get("/login", (req, res, next) => {
  res.sendFile(htmlPath + "/login.html");
});
router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

router.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
    );
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
  });
  res.redirect("/protected-route");
});

module.exports = router;
