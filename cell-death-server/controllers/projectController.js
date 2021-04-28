const pythonController = require('../controllers/pythonController');
const loggerController = require('../controllers/loggerController');
const mailController = require('../controllers/mailerController')
var DButils = require("../DB/DButils");

 function isExperimentExists(experiment_id){
    DButils.experimentDetails(experiment_id).then((results)=>{
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
                experiment_id: experiment_id,
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

async function addProjectToDB(experiment_details, experiment_id){
    try{
        let results = await DButils.addExperiment(experiment_details);
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

exports.isExperimentExists = isExperimentExists
exports.extractRar = extractRar
exports.addProjectToDB = addProjectToDB
