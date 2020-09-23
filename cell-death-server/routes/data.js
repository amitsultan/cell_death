var express = require("express");
var router = express.Router();

router.use(function (req, res, next) {
    if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM dbo.users")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
            console.log("user middelwar testing");
          }
          next();
        })
        .catch((error) => next(error));
    } else {
      res.sendStatus({
        status: 401,
        message: "Content is not available to an unrecognized user please log-in",
      }); // if user not found or cookie doesn't exist return unauthorized
    }
  });


// router.get("/showData", (req, res) => {

// });

router.get("/process/:numberOfImages", (req, res) => {


});

router.get("/saveData", (req, res) => {

});

router.get("/directories", (req, res) => {
  let listOfDirectories;
  const path = require('path');
  const fs = require('fs');

  const directoryPath = "";
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
      });
    });
  });

module.exports = router;
