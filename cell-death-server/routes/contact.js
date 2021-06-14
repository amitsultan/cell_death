var express = require("express");
var router = express.Router();
var DButils = require("../DB/DButils");
const mailController = require('../controllers/mailerController')
const loggerController = require('../controllers/loggerController')


router.post("/contactUs", (req, res) => {
    try{
        if(!req.body || !req.body.client_name || !req.body.client_email || !req.body.subject || !req.body.message){
            loggerController.log('error','contactUs: Missing params from client', {body:req.body})
            res.status(500).send("Failed to send mail, missing fields!")
        }else{
            
            mailController.sendContactUs(req.body.client_name, req.body.client_email, req.body.subject, req.body.message).then((results)=>{
            }).catch((error)=>{
                loggerController.log('error','contactUs: Unexcpeted error', {error: error})
                res.status(500).send("Failed to send mail, please contact us directly on\ncelltrackingtool@gmail.com")
            })
            //TODO
            DButils.addContactRequest(req.body.client_name, req.body.client_email, req.body.subject, req.body.message).
            then((results)=>{
                res.status(200).send('OK')

            }).catch((error)=>{
                loggerController.log('error','contactUs: Failed to save to db!', {error: error})
            })
        }
    }catch(err){
        loggerController.log('error','contactUs: Unexcpeted error', {body:req.body})
        res.status(500).send("Failed to send mail, please contact us directly on\ncelltrackingtool@gmail.com")
    }
});

module.exports = router;
