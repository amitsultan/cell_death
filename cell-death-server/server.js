// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//routes import
const auth = require("./routes/auth");
const data = require("./routes/data");

var app = express();
var port = 8081;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//settings cors
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//Routing

app.use("/data", data);
app.use(auth);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

app.listen(port);
console.log(`Running on PORT: ${port}`);
