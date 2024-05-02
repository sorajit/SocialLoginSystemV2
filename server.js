require("dotenv").config();
const express = require("express");
const passport = require('passport');
const routes = require("./routes/routes");
const app = express();
const PORT = process.env.APP_PORT;

// set up session store
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db/db");
db.sequelize.sync();
const sessionStore = new SequelizeStore({
  db: db.sequelize,
});
const express_session = session({
  store: sessionStore,
  secret: "mykey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express_session);
app.use(passport.initialize());
app.use(passport.session());
require('./passport/passport');
app.use((req,res,next)=>{
    console.log(req.session);
    console.log(req.user);
    next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`server is listening  on ${PORT}`);
});
app.listen();
