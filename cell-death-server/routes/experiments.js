var express = require("express");
var router = express.Router();

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
  try{
    const experimentId = req.params.experimentId;
    const imageId = req.params.imageId;
    const path = "..data/" + experimentId + '/' + imageId + '.png';
    res.status(200).sendFile(path);
  }
  catch(err){
    res.status(500).send("Unable to get image")
  }

});

// router.get("/getImages/:experimentId/:numberOfImages", (req, res) => {
//   //returns $numberOfImages images from $experimentId and total number of images in the experiment
//   const fs = require('fs');
//   const experimentId = req.params.experimentId;
//   const numberOfImages = req.params.numberOfImages;
//   //open right directoriy
//   const path = "C:/programingProjects/data/" + experimentId;
//   var listOfImages = [];
//   fs.readdir(path, function (err, files) {
//     //handling error
//     if (err) {
//       res.status(500).send('Unable to get experiment');
//     }
//     //sort directory
//     files.sort();
//     //get first $numberOfImages images
//     for(var i=0; i<numberOfImages;i++){
//       listOfImages.push(path+'/'+files[i]);
//     } 
//     //get csv file?
//     res.status(200).send(listOfImages)
//     return listOfImages
//   });
  
//   res.status(200).send(listOfImages)

// });


// router.get("/saveData", (req, res) => {

// });

router.get("/getExperiments", (req, res) => {
  var listOfDirectories = [];
  const fs = require('fs');

  const directoryPath = "../data";//change according to local path
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      res.status(500).send('Unable to get experiments');
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        listOfDirectories.push(file); 
      });
    res.status(200).send(listOfDirectories)
  });
});
//!!!!!make sure that the image id is the same as frame id!!!!!
router.get("/getCsvDataById/:experimentId/:imageId", (req, res) => {
  try{
    const csv = require('csv-parser');
    const fs = require('fs');
    const experimentId = req.params.experimentId;
    const imageId = req.params.imageId;
    const path = "..data/" + experimentId + '/' + experimentId + '.csv';
    var listOfData = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        var record = row.split(",");
        if(record[3] === imageId)
          listOfData.push(row);
    })
    .on('end', () => {
    console.log('CSV file successfully processed');
    res.status(200).send(listOfData);
    });
    
  }
  catch(err){
    res.status(500).send("Unable to get csv data");
  }

});

module.exports = router;
