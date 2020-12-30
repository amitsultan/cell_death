// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const { v4: uuidv4 } = require("uuid");


//routes import
const auth = require("./routes/auth");
const experiments = require("./routes/experiments");
const general_jobs = require("./routes/general");




var app = express();
var port = process.env.PORT || 8081;

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
    },
    unset: "destroy",
  })
);


// Session middleware to check if user cookie is still saved when user is not set
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.email) {
    res.clearCookie("user_sid");
  }
  next();
});

//settings cors
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//Routing

app.use("/experiments", experiments);
app.use("/administration",general_jobs)
app.use(auth);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

app.listen(port);
console.log(`Running on PORT: ${port}`);
