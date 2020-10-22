var express = require("express");
var router = express.Router();
const neatCsv = require("neat-csv");
const { Time } = require("mssql");
var fs = require("fs");
// var Unrar = require("unrar");
var multer = require("multer");
var upload = multer(); 
const fileUpload = require('express-fileupload');
router.use(fileUpload());
var $ = (jQuery = require("jquery"));
$.csv = require("jquery-csv");

// router.use(function (req, res, next) {
//     if (req.session && req.session.user_id) {
//       DButils.execQuery("SELECT user_id FROM dbo.users")
//         .then((users) => {
//           if (users.find((x) => x.user_id === req.session.user_id)) {
//             req.user_id = req.session.user_id;
//             console.log("user middelwar testing");
//           }
//           next();
//         })
//         .catch((error) => next(error));
//     } else {
//       res.sendStatus({
//         status: 401,
//         message: "Content is not available to an unrecognized user please log-in",
//       }); // if user not found or cookie doesn't exist return unauthorized
//     }
//   });

router.get("/getImageById/:experimentId/:imageId", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const imageId = req.params.imageId;
    const path = "..data/" + experimentId + "/" + imageId + ".png";
    res.status(200).sendFile(path);
  } catch (err) {
    res.status(500).send("Unable to get image");
  }
});


router.get("/getExperiments", (req, res) => {
  var listOfDirectories = [];
  const fs = require("fs");

  const directoryPath = "../data"; //change according to local path
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      res.status(500).send("Unable to get experiments");
    }
    //listing all files using forEach
    files.forEach(function (file) {
      listOfDirectories.push(file);
    });
    res.status(200).send(listOfDirectories);
  });
});

//important!!! make sure that the image id is the same as frame id!!!!!
router.get("/getCsvDataById/:experimentId/:frameId", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const frameId = req.params.frameId;
    const path = "../data/" + experimentId + "/" + experimentId + ".csv";
    var listOfData = [];
    fs.readFile(path, "UTF-8", function (err, csv) {
      $.csv.toArrays(csv, {}, function (err, data) {
        for (var i = 0, len = data.length; i < len; i++) {
          if (data[i][3] === frameId) listOfData.push(data[i]);
        }
      });
      if (err) {
        res.status(500).send("Unable to get csv data");
      }
      let listOfDataAfterEditing = EditListOfData(listOfData);
      console.log(listOfDataAfterEditing);
      res.status(200).send(listOfDataAfterEditing);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to get csv data");
  }
});

function EditListOfData(listOfData) {
  return listOfData.map((row) => {
    return {
      id: row[0],
      X: row[1],
      Y: row[2],
      time: row[3],
    };
  });
}


//upload rar file 
router.post('/upload', (req, res) => {

  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" })
  }
  // accessing the file
  const myFile = req.files.file1;
  console.log(req.files)
  //  mv() method places the file inside public directory
  myFile.mv(`${myFile.name}`, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send({ msg: "Error occured" });
    }
    // returing the response with file path and name
    return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });
})


module.exports = router;

  
