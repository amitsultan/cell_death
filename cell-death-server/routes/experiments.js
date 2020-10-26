var express = require("express");
var router = express.Router();
const fs = require("fs");
var DButils = require("../DB/DButils");
var ConvertTiff = require("tiff-to-png");
const dataDirectory = "../data";
var $ = jQuery = require('jquery');
$.csv = require('jquery-csv');
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const pythonController = require('../controllers/pythonController')

var options = {
  logLevel: 0,
};

var converter = new ConvertTiff(options);


// Helper function - return directories inside path
const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);


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


router.get("/nextImage/:experimentId/:imageId", (req, res) => {
  //returns the next image of the $experimentId
});

router.get("/getImages/:experimentId/:numberOfImages", (req, res) => {
  //returns $numberOfImages from $experimentId and total number of images in the experiment

});

// router.get("/saveData", (req, res) => {

// });

router.get("/getExperiments", (req, res) => {
  try {
    const directories_names = getDirectories(dataDirectory);
    res.status(200).send(directories_names);
  } catch (error) {
    console.log(error)
    res.status(500).send("Unable to load experiments");
  }
});

const createPNGs = async (serial) => {
  return new Promise(async (resolve, reject) => {
    let location = dataDirectory + "/" + serial + "/images/";
    let save_location = dataDirectory + "/" + serial + "/images/images_png";
    fs.readdir(dataDirectory + "/" + serial + "/images", async (err, files) => {
      if (err) {
        reject(err)
      } else {
        // Filter tif files from others
        let tif_array = [];
        const tifFiles = files.filter((el) => /\.tif$/.test(el));
        tifFiles.forEach((file) => {
          tif_array.push(location + file);
        });
        await converter.convertArray(tif_array, save_location).catch((err) => {
          console.log(err);
          reject(err)
        });
        resolve()
      }
    });
  })
}

router.get("/getImageById/:experimentId/:imageId", (req, res) => {
  try {
    if (!req.params.experimentId || !req.params.imageId) {
      res.status(400).send("Missing params");
    }
    const experimentId = req.params.experimentId;
    const imageId = req.params.imageId;
    const path = experimentId + "/images/images_png/" + experimentId + "_" + imageId + ".png";
    if (!fs.existsSync(dataDirectory + "/" + experimentId + "/images/images_png")) {
      createPNGs(experimentId).then(() => {
        res.status(200).sendFile(path, { root: dataDirectory });
      }).catch((err) => {
        console.log(err);
        res.status(500).send("Unable to get image");
      })
    } else {
      res.status(200).sendFile(path, { root: dataDirectory });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Unable to get image");
  }
});

router.get("/getDetails/:experimentId", (req, res) => {
  try{
    if (!req.params.experimentId)
      throw new Error("Must have experiment ID")
    let id = req.params.experimentId
    DButils.experimentDetails(id).then((experiment) => {
      if(experiment.length == 0){
        res.status(404).send("experiment not found");        
      }else{
        res.status(200).send(experiment[0])
      }
    }).catch((error) => {
      throw error
    })
  }catch(err){
    console.log(err)
    res.status(500).send("Unable to get fetch details for experiment");
  }
});


//important!!! make sure that the image id is the same as frame id!!!!!
router.get("/getCsvDataById/:experimentId/:frameId", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const frameId = req.params.frameId;

    const path = "../data/" + experimentId + "/" + experimentId + ".csv";
    var listOfData = [];
    fs.readFile(path, "UTF-8", function (err, csv) {
      if(err){
        console.log(err)
        res.status(500).send("Unable to get data");
      }
      else{
        $.csv.toArrays(csv, {}, function (err, data) {
          if(err){
            console.log(err)
            res.status(500).send("Unable to get data");
          }
          else{
            for (var i = 0, len = data.length; i < len; i++) {
              if (data[i][3] === frameId) listOfData.push(data[i]);
            }
          }
        });
        let listOfDataAfterEditing = EditListOfData(listOfData);
        console.log(listOfDataAfterEditing);
        res.status(200).send(listOfDataAfterEditing);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to get csv data");
  }
});


// Reciving file should be located under projectRar name.
router.post('/uploadProject', (req, res) => {
  console.log(req)
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found"})
  }
  // accessing the file
  const myFile = req.files.projectRar;
  if (!req.files.projectRar){
    return res.status(500).send({ msg: "No file found under rar" });
  }
    //  mv() method places the file inside public directory
    myFile.mv(`../data/${myFile.name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      let fileName = myFile.name;
      // Call python to handle unrar\unzip of the project file
      pythonController.unArchiveData(fileName)
      return res.status(200).send({ msg: 'Project rar successfully saved!', success: true });
    });
})




module.exports = router;
exports.createPNGs = createPNGs;