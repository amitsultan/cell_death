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
const mailController = require('../controllers/mailerController')
const loggerController = require('../controllers/loggerController')
const csvEditorController = require('../controllers/csvEditorController')
const projectController = require('../controllers/projectController')
var sizeOf = require('image-size');
const {uploadProjectHandler} = require('../handlers/experiments.js') 
var options = {
  logLevel: 0,
};

var converter = new ConvertTiff(options);


function EditListOfData(listOfData) {
  return listOfData.map((row) => {
    return {
      id: row.id,
      x: row.x,
      y: row.y,
      frame: row.frame,
      type: row.type,
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

const createPNGs = async (serial, extension) => {
  // return new Promise(async (resolve, reject) => {
  try
  {
    if(!extension || extension == '-'){
      extension = ''
    }
    let location = dataDirectory + "/" + serial + extension + "/images/";
    let save_location = dataDirectory + "/" + serial + extension + "/images/images_png/";
    if (!fs.existsSync(save_location)){
      fs.mkdirSync(save_location);
    }
    let res = await pythonController.convertTifToPng(location, save_location)
    return res
  }
  catch(error)
  {
    throw error
  }
}

router.get("/getImageById/:experimentId/:imageId", (req, res) => {
  try {
    if (!req.params.experimentId || !req.params.imageId) {
      return res.status(400).send("Missing params");
    }
    const experimentId = req.params.experimentId;
    const imageId = req.params.imageId;
    const path = experimentId + "/images/images_png/" + experimentId + "_" + imageId + ".png";
    if (!fs.existsSync(dataDirectory + "/" + experimentId + "/images/images_png")) {
      createPNGs(experimentId).then(() => {
        return res.status(200).sendFile(path, { root: dataDirectory });
      }).catch((err) => {
        console.log(err);
        return res.status(500).send("Unable to get image");
      })
    } else {
      return res.status(200).sendFile(path, { root: dataDirectory });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send("Unable to get image");
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
      res.status(500).send(" BD error - Unable to get fetch details for experiment");
    })
  }catch(err){
    console.log(err)
    res.status(500).send("Unable to get fetch details for experiment");
  }
});

router.get("/experimentCSV/:experimentId", (req, res) => {
  let data_path = "../data/"
  let experiment_id = req.params.experimentId
  try{
    if(!experiment_id){
      loggerController.log('error','experimentCSV: No experiment ID folder', {experiment_id: experiment_id, error:err})
      res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
    }else{
      let m_path = require("path");
      let path = m_path.resolve(data_path + experiment_id + "/" + experiment_id +".csv")
      console.log(path)
        fs.readFile(path, 'utf8', function (err,data) {
          if (err) {
            console.log(err)
            loggerController.log('error','experimentCSV: Failed to read file', {experiment_id: experiment_id, error:err})
            res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
          }else{
            console.log("else")
            res.setHeader('Content-disposition', 'attachment; filename='+experiment_id+'.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(data);
          }
        });
    }
  }catch(err){
    loggerController.log('error','experimentCSV: Unexcpeted error', {experiment_id: experiment_id, error:err})
    res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
  }
});

//important!!! make sure that the image id is the same as frame id!!!!!
router.get("/getCsvDataById/:experimentId/:frameId", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const frameId = req.params.frameId;

    const path = "../data/" + experimentId + "/" + experimentId + ".csv";
    var listOfData = [];
    csvEditorController.getCsvRowsByFrame(path, frameId).then((results)=>{
      let map = EditListOfData(results)
      res.status(200).send(map)
    }).catch((error)=>{
      loggerController.log('error','getCsvDataById: Unexcpeted error', {experiment_id:experimentId, frame_id:frameId, error:error})
      res.status(500).send("Unable to get marks data");  
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to get marks data");
  }
});

// update csv file by removing all giving frame marks
// and inserting the new marks for the giving frame
router.post("/updateCsvDataById/:experimentId/:frameId", (req, res) => {
  try {
    const experimentId = req.params.experimentId;
    const frameId = req.params.frameId;
    const path = "../data/" + experimentId + "/" + experimentId + ".csv";
    let data = req.body.rows
    csvEditorController.editCsvFrame(path, data, frameId).then((results)=>{
      console.log("updated")
      console.log(req.session.userID)
      loggerController.log('info','updateCsvDataById: Marks updated!', {experiment_id:experimentId, frame_id:frameId, userID: req.session.userID})
      res.status(200).send("marks updated for frame: "+frameId);  
    }).catch((error)=>{
      console.log(error)
      loggerController.log('error','updateCsvDataById: Unexcpeted error', {experiment_id:experimentId, frame_id:frameId, error:error})
      res.status(500).send("Unable to get csv data");  
    })
  } catch (error) {
    console.log(error)
    loggerController.log('error','updateCsvDataById: Unexcpeted error', {error:error.message})
    res.status(500).send("Unable to get csv data");
  }
});

// Reciving file should be located under projectRar name.

router.post('/uploadProject',uploadProjectHandler)

module.exports = router
exports.createPNGs = createPNGs
// exports.getDirectories = getDirectories