const pythonController = require('../controllers/pythonController');
const loggerController = require('../controllers/loggerController');
const mailController = require('../controllers/mailerController')
var DButils = require("../DB/DButils");

 async function isExperimentExists(experiment_id){
    await DButils.experimentDetails(experiment_id).then((results)=>{
        return results > 0 
    }).catch((err) => {
        console.log(err)
        throw {status: 'failed', message: 'failed to check db', error: err}
    })
}

async function extractRar(file_name, experiment_id, userID, extension){
    try{
        let results = await pythonController.unArchiveData(file_name, extension);
        if(results.message &&  results.message == 'Images created successfully'){
            return {
                experiment_id: experiment_id+extension,
                date: new Date(),
                num_pictures: results.num_pictures,
                width: results.width,
                height: results.height,
                user_id: userID
            }
        }else{
            loggerController.log('error','uploadProject: failed to unrar', experiment_id);
            throw 'failed to extract rar'
        }
    }catch(error){
        throw {status: 'failed', message: 'failed to extract rar', error: error}
    }
}

async function addProjectToDB(experiment_details, experiment_id, parent_id){
    try{
        let results = await DButils.addExperiment(experiment_details, parent_id);
        if(results && results.affectedRows && results.affectedRows == 1){
            loggerController.log('info','uploadProject: experiment added to add db', experiment_id);
            return true
            }else{
            loggerController.log('error','uploadProject: experiment failed to add db', experiment_id);
            throw 'failed add to db'
        }
    }catch(error){
        throw {status: 'failed', message: 'failed add to db', error: error}
    }
}

async function handleExtraChannel(extra_channel, user_id, parent_id){
    console.log("here it is: "+extra_channel);
    extra_channel.mv(`../data/${extra_channel.name}`, async function (err) {
        if (err) {
          console.log("here error: "+err);
          res.status(500).send({ msg: "Error occured" });
          return
        }else{
          let fileName = extra_channel.name;
          let experiment_id = fileName.split('.').slice(0, -1).join('.');
          // check if the experiment is in the database
          let isExists = await isExperimentExists(experiment_id);
          if(!isExists){
            let experiment_details = await extractRar(fileName, experiment_id, user_id, '_SC');
            console.log(experiment_details);
            if(experiment_details != undefined){
              if(addProjectToDB(experiment_details, experiment_id, parent_id)){
                loggerController.log('info','uploadProject: upload succesfully', experiment_id);
              }
            }else{
                loggerController.log('error', 'uploadProject: Unexcpeted error')
            }
          }
        }
    });
}

exports.isExperimentExists = isExperimentExists
exports.extractRar = extractRar
exports.addProjectToDB = addProjectToDB
exports.handleExtraChannel = handleExtraChannel
