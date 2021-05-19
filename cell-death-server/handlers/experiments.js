const mailController = require('../controllers/mailerController')
const loggerController = require('../controllers/loggerController')
const projectController = require('../controllers/projectController')
var DButils = require("../DB/DButils");

const uploadProjectHandler = async function(req, res){
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
                  try{
                    await DButils.addPremissions(experiment_details.user_id, experiment_details.experiment_id)
                  }catch(error){
                    let failure_message = 'could not add permission'
                    loggerController.log('error', 'uploadProject: Adding premissions failed',err)
                    mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)
                  }
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
    }catch(error){
      loggerController.log('error', 'uploadProject: Unexcpeted error',error)
      return res.status(500).send({ msg: "Error occured" });
    }
}
module.exports = {uploadProjectHandler}