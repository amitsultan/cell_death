// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const { v4: uuidv4 } = require("uuid");
var history = require('connect-history-api-fallback');
const path = require('path')
//routes import
const auth = require("./routes/auth");
const experiments = require("./routes/experiments");
const general_jobs = require("./routes/general");
const profile = require("./routes/profile");


var app = express();
app.use('',express.static(path.join(__dirname, './../cell-death-client/dist/')))
app.get('/', (req,res) => {
  console.log(path.join(__dirname, '../cell-death-client/dist/index.html'))
  res.sendFile(path.join(__dirname, '../cell-death-client/dist/index.html'));
});
var port = process.env.PORT || 8081;
app.use(history());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    user_sid: function (req) {
      return uuidv4(); // use UUIDs for session IDs
    },
    key: "user_sid",
    secret: "T4am2w1n2",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 120 * 60 * 1000,
      // expires:  60,
    },
    unset: "destroy",
  })
);

// Session middleware to check if user cookie is still saved when user is not set
// app.use((req, res, next) => {
//   if (req.cookies.user_sid && !req.session.userID) {
//     res.clearCookie("user_sid");
//   }
//   next();
// });
//settings cors
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//Routing

app.use(auth);
app.use("/experiments", experiments);
app.use("/administration",general_jobs);
app.use("/profile", profile);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});
const host = '0.0.0.0'
app.listen(port, host);
console.log(`Running on PORT: ${port} on host ${host}`);

module.exports = app;