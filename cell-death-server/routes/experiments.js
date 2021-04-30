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


<<<<<<< HEAD
router.get("/getExperiments", (req, res) => {
=======
router.get("/nextImage/:experimentId/:imageId", (req, res) => {
  //returns the next image of the $experimentId
});

router.get("/getImages/:experimentId/:numberOfImages", (req, res) => {
  //returns $numberOfImages from $experimentId and total number of images in the experiment

});

// router.get("/saveData", (req, res) => {

// });

router.get("/getExperiments", async (req, res) => {
>>>>>>> added extra channel
  try {
    const directories_names = getDirectories(dataDirectory);
    let results = []
    for await (directory of directories_names) {
      if(!directory.endsWith("_SC")){
        results.push(directory)
      }
    }
    res.status(200).send(results);
  } catch (error) {
    console.log(error)
    res.status(500).send("Unable to load experiments");
  }
});

const createPNGs = async (serial, extension) => {
  return new Promise(async (resolve, reject) => {
    let location = dataDirectory + "/" + serial + extension + "/images/";
    let save_location = dataDirectory + "/" + serial + extension + "/images/images_png";
    fs.readdir(dataDirectory + "/" + serial + extension + "/images", async (err, files) => {
      if (err) {
        reject(err)
      } else {
        // Filter tif files from others
        let tif_array = [];
        const tifFiles = files.filter((el) => /\.tif$/.test(el));
        let is_dimensions_saved = false
        let width = 0
        let height = 0
        tifFiles.forEach((file) => {
          tif_array.push(location + file);
          if (!is_dimensions_saved){
            sizeOf(location + file, function (err, dimensions) {
              if(err){
                reject("Couldn't fetch image dimensions")
              }else{
                width = dimensions.width;
                height = dimensions.height;
              }
            });
            is_dimensions_saved = true
          }
        });
        console.log("all went well");
        await converter.convertArray(tif_array, save_location).catch((err) => {
          console.log("converter: "+err)
          reject(err)
        });
        let images_details = {
          num_pictures: tifFiles.length,
          width: width,
          height: height
        }
        resolve(images_details)
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

router.get("/experimentCSV/:experimentId", (req, res) => {
  try{
    let data_path = "../data/"
    let experiment_id = req.params.experimentId
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
<<<<<<< HEAD
router.post('/uploadProject', async (req, res)=> {
=======
router.post('/uploadProject', async (req, res) => {
>>>>>>> init branch
  if(!req.session.userID){
    loggerController.log('error', 'uploadProject: Unauthorized user', 'User must be logged in')
    return res.status(500).send({ msg: "User must be logged in"})
  }
  try{
    if (!req.files) {
      loggerController.log('error', 'uploadProject: Bad request', 'file is not found')
      return res.status(500).send({ msg: "file is not found"})
    }
    // accessing the file
    const project_rar = req.files.projectRar;
    const extra_channel = req.files.extraChannel;
    if (!req.files.projectRar){
      return res.status(500).send({ msg: "No file found under rar" });
    }
<<<<<<< HEAD
    //  mv() method places the file inside public directory
    myFile.mv(`../data/${myFile.name}`,async function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      let fileName = myFile.name;
      let experiment_id = fileName.split('.').slice(0, -1).join('.');
      res.status(200).send({ msg: 'Project rar recived! Email will be sent when processing done', success: true });
        // check if the experiment is in the database
      let experiment_data = await DButils.experimentDetails(experiment_id).catch((error)=>{
        loggerController.log('error', 'uploadProject: Failed to fetch experiemtn data from database',error)
        return res.status(500).send({ msg: "Error occured" });
      })
      if(experiment_data.length == 0){
            // new project
            // Call python to handle unrar\unzip of the project file
            // After unziping the experiment pngs files will be avilable to watch
        let unarchive = await pythonController.unArchiveData(fileName).catch((error)=>{
          console.log("our error is :" + error)
          let failure_message = 'Unexpected error in server side'
          loggerController.log('error', 'uploadProject: Python script failed',error)
          mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
          })
          loggerController.log('info','uploadProject: unrar successesfully', experiment_id)
              // check if python script excuted in success
              // if not, we have a folder with the same experiment name
          if(unarchive.message &&  unarchive.message == 'Images created successfully'){
            let experiment_details = {
              experiment_id: experiment_id,
              date: new Date(),
              num_pictures: unarchive.num_pictures,
              width: unarchive.width,
              height: unarchive.height,
              user_id: req.session.userID}
              let add_exp = await DButils.addExperiment(experiment_details).catch((error)=>{
                let failure_message = 'Unexpected error in server side'
                loggerController.log('error', 'uploadProject: Adding experiment to database failed',error)
                mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)})

              if(add_exp && add_exp.affectedRows && add_exp.affectedRows == 1){
                  loggerController.log('info','uploadProject: experiment added to db', experiment_id)
                  await DButils.addPremissions(experiment_details.user_id, experiment_details.experiment_id).catch((err)=>{
                    let failure_message = 'could not add permission'
                    loggerController.log('error', 'uploadProject: Adding premissions failed',err)
                    mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)})

                  mailController.sendSuccessEmail(req.session.email, experiment_id)
                      
                      // send email after successfully update the database with the experiment

                      // add back when trackmate script is working
                      // var start = new Date();
                      // pythonController.runTrackMate(experiment_id).then((results)=>{
                      //   if(results.message && results.message == "Experiment processed successfully")
                      //     var end = new Date - start
                      //     loggerController.log('info', 'uploadProject: Trackmete finished succsessfully, execution time was ' + end + ' ms', experiment_id)
                      //     mailController.sendSuccessEmail(req.session.email, experiment_id)

                      // }).catch((error)=>{
                      //   console.log(error)
                      //   let failure_message = 'Failed to run Trackmate'
                      //   mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
                      // })
                      
              }else{
                  // already in database
                  let failure_message = 'Experiment already found in our database'
                  mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
              }
                // mail the user for success
          }else if(results.message &&  results.message ==  'Experiment already exists'){
            // console.log(results)
            let failure_message = 'Experiment already found in our database'
            mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
          }else{ // else for unexpceted cases
            let failure_message = 'Unexpected error in server side'
            mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
            loggerController.log('error', 'uploadProject: Python script failed',results)
            }
    }else{
      let failure_message = 'Experiment already found in our database'
      mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
    }
  }).catch((error)=>{
    let failure_message = 'Unexpected error in server side'
    loggerController.log('error', 'uploadProject: Unexcpeted error',error)
    mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)})
=======
      //  mv() method places the file inside public directory
      project_rar.mv(`../data/${project_rar.name}`, async function (err) {
        if (err) {
          console.log("here error: "+err);
          res.status(500).send({ msg: "Error occured" });
          return
        }else{
          let fileName = project_rar.name;
          let experiment_id = fileName.split('.').slice(0, -1).join('.');
          let fileName_sc = extra_channel.name;
          let experiment_id_sc = fileName_sc.split('.').slice(0, -1).join('.')+"_SC";
          res.status(200).send({ msg: 'Project rar recived! Email will be sent when processing done', success: true });
          // check if the experiment is in the database
          let isExists = await projectController.isExperimentExists(experiment_id);
          if(!isExists){
            let experiment_details = await projectController.extractRar(fileName, experiment_id, req.session.userID, '');
            console.log(experiment_details);
            if(experiment_details != undefined){
              if(projectController.addProjectToDB(experiment_details, experiment_id, experiment_id_sc)){
                loggerController.log('info','uploadProject: upload succesfully', experiment_id);
                if(extra_channel){
                  projectController.handleExtraChannel(extra_channel, req.session.userID, experiment_id);
                }
              }
            }else{
                loggerController.log('error', 'uploadProject: Unexcpeted error')
            }
          }
        }
      });
>>>>>>> init branch
  }catch(error){
    loggerController.log('error', 'uploadProject: Unexcpeted error',error)
    return res.status(500).send({ msg: "Error occured" });
  }
})




module.exports = router;
exports.createPNGs = createPNGs;