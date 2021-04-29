var express = require("express");
var router = express.Router();
var DButils = require("../DB/DButils");

// router.use(function (req, res, next){    
//     if (req.session.email && req.cookies.user_sid) {
//         res.status(200);
//         console.log("middle testing");
//         next();
//     } else {
//         res.redirect('/');
//     }    
// });

router.post("/getProfile", async(req, res, next)=>{
    console.log(req.body)
    if(req.body.userId){
        DButils.getExperimantForUser(req.body.userId).then((experiments)=>{
            if(experiments.length > 0){
                ids = []
                experiments.forEach(exp => ids.push(exp.experiment_id))
                console.log(ids)
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
        throw { status: 500, message: "email must be provided" };
      }
      DButils.execQuery("SELECT email FROM users")
      .then((users) => {
        if (!users.find((x) => x.email === req.body.email))
          throw { status: 401, message: "Email is incorrect" };
        DButils.userByEmail(req.body.email)
          .then((user) => {
            if (user.length > 1) {
              throw {
                status: 401,
                message: "Error occurred, Please contact us",
              };
            } else if (user.length == 0) {
              throw { status: 401, message: "Email is incorrect" };
            } else {  
              res.status(200).send({status: 200, message: user[0].id});
            }
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      })
    }catch(error){
      next(error);
    }
  });
  
// gets user_id of the user asking to give permission, 
// email of the user to give permissions to,
// experiment id to the give permissions to.
router.post("/addPermissions", async (req, res, next) => 
{
    try{
        if(!req.body.user_id || !req.body.email || !req.body.projectId){
            throw { status: 500, message: "one or more of the details is missing" };
        }
        else{
            const check = await DButils.checkForPermissions(req.body.user_id, req.body.projectId)
            if(check === true){
                const user = await DButils.userByEmail(req.body.email);
                const project = await DButils.projectById(req.body.projectId);
                if(user.length>0 && project.length>0){
                    console.log('add the permission to db')
                    try {
                        const success = await DButils.addPremissions(user[0].id, project[0].experiment_id);
                        console.log("added premission successfully");
                        res.status(200).send({status: 200, message: "added premission successfully"});
                    }catch(error){
                        console.log("already exist in db")
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
          throw { status: 500, message: "one or more of the details is missing" };
      }
      else{
          const check = await DButils.checkForPermissions(req.body.user_id, req.body.projectId)
          if(check === true){
              const user = await DButils.userByEmail(req.body.email);
              const project = await DButils.projectById(req.body.projectId);
              if(user.length>0 && project.length>0){
                  console.log('delete permission from db')
                  try {
                      const success = await DButils.deletePremissions(user[0].id, project[0].experiment_id);
                      if(success.length>0){
                        console.log("delete premission successfully");
                        return res.status(200).send({status: 200, message: "delete premission successfully"});
                      }
                      else{
                        res.status(400).send({status: 400, message: "could not delete permission. user or experiment not exists"});
                      }
                  }catch(error){
                      console.log("not found in db")
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
module.exports = router;