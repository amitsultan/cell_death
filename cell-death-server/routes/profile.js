var express = require("express");
var router = express.Router();
var DButils = require("../DB/DButils");
const loggerController = require('../controllers/loggerController')


router.post("/getProfile", async(req, res, next)=>{
    if(req.body.userId){
        DButils.getExperimantForUser(req.body.userId).then((experiments)=>{
            if(experiments.length > 0){
                ids = []
                experiments.forEach(exp => ids.push(exp.experiment_id))
                res.status(200).send(ids);
            }
            else{
                res.status(400).send("no experiments found");
            }
        }  
        );
    }
    else{
        res.status(500).send("missing user id");
    }       
})

router.post("/getUserIdByEmail", async (req, res, next) => {
    try{
      if (!req.body.email) {
        return res.status(500).send({message: "email must be provided" });
      }
      var user = await DButils.userByEmail(req.body.email)
      if (user.length == 0) {
        return res.status(401).send({message: "Email is incorrect"});
      } else {

        return res.status(200).send({message: user[0].id});
      }
    }catch(error){
      return res.status(401).send({message: "user not found"});
    }
  });
  
// gets user_id of the user asking to give permission, 
// email of the user to give permissions to,
// experiment id to the give permissions to.
router.post("/addPermissions", async (req, res, next) => 
{
    try{
        if(!req.body.user_id || !req.body.email || !req.body.projectId){
            return res.status(500).send({ message: "one or more of the details is missing" });
        }
        else{
            const check = await DButils.checkForPermissions(req.body.user_id, req.body.projectId)
            if(check === true){
                const user = await DButils.userByEmail(req.body.email);
                const project = await DButils.experimentDetails(req.body.projectId);
                if(user.length>0 && project.length>0){
                  loggerController.log('info','add the permission to db')
                    try {
                        const success = await DButils.addPremissions(user[0].id, project[0].experiment_id);
                        loggerController.log('info',"added premission successfully", {user: user[0].id, project: project[0].experiment_id});
                        res.status(200).send({status: 200, message: "added premission successfully"});
                    }catch(error){
                        loggerController.log('error', "already exist in db", {user: user[0].id, project: project[0].experiment_id})
                        res.status(500).send("already exist in db")
                    }
                }
                else{
                    return res.status(400).send({status: 400, message: "could not add permission. user or experiment not exists"});
                }
            }
            else{
                return res.status(400).send({status: 400, message: "permission denied!"});
            }
        }
            
    }
    catch (error) {
        next(error);
    }

});
router.post("/deletePermissions", async (req, res, next) => {
  try{
      if(!req.body.user_id || !req.body.email || !req.body.projectId){
          return res.status(500).send({ status: 500, message: "one or more of the details is missing" });
      }
      else{
          const check = await DButils.checkForPermissions(req.body.user_id, req.body.projectId)
          if(check === true){
              const user = await DButils.userByEmail(req.body.email);
              const project = await DButils.experimentDetails(req.body.projectId);
              if(user.length>0 && project.length>0){
                loggerController.log('info','delete permission from db')
                  try {
                      const success = await DButils.deletePremissions(user[0].id, project[0].experiment_id);
                      if(success.length>0){
                        loggerController.log('info',"delete premission successfully", {user: user[0].id, project: project[0].experiment_id});
                        return res.status(200).send({status: 200, message: "delete premission successfully"});
                      }
                      else{
                        res.status(400).send({status: 400, message: "could not delete permission. user or experiment not exists"});
                      }
                  }catch(error){
                    loggerController.log('error',"not found in db")
                      res.status(500).send({status: 500, message:"not found in db"})
                  }
              }
              else{
                  res.status(400).send({status: 400, message: "could not delete permission. user or experiment not exists"});
              }
          }
          else{
              res.status(400).send({status: 400, message: "permission denied!"});
          }
      }
          
  }
  catch (error) {
      next(error);
  }
});

router.post("/deleteExperiment", async (req, res, next) => {
  if(!req.body.user_id || !req.body.experiment_id){
    return res.status(500).send("one or more of the details is missing")
  }
  const check = await DButils.checkForPermissions(req.body.user_id, req.body.projectId)
  if(check === true){
    //remove experiment from all tables
    // remove from data directory
  }

})
module.exports = router;