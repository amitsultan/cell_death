const { text } = require("express");
const nodemailer = require("nodemailer");
const loggerController = require('./loggerController')


var transporter = nodemailer.createTransport('smtps://'+process.env.MAILER_EMAIL+':'+ process.env.MAILER_PASSWORD+'@smtp.gmail.com');


// const levels = { 
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// };


function getMailOptions(to_email, subject, text){
    return {
        from: process.env.MAILER_EMAIL,
        to: to_email,
        subject: subject,
        text: text
    }
}

function sendSuccessEmail(to_email, experiment_id) {
    let subject = "Project "+experiment_id+" uploaded successfully"
    let text = "Project with id: "+experiment_id+"uploaded successfully"+'\n'+
                "You can view it under experiments in the website and begin the tagging process,"+"\n"+
                "if any problems occur please contact us by replying back!"+"\n"+
                "Thank you,\n BGU team Amit, Liat, Yarin, Haim"
    let mail_options = getMailOptions(to_email, subject, text)
    transporter.sendMail(mail_options, (err, info) => {
        if(err){
            let message = 'Failed to send mail';
            let content = mail_options
            loggerController.log('error', message, content)
        }else{
            let message = 'Email successfully sent';
            let content = {
                envelope: info.envelope,
                messageId: info.messageId
            }
            loggerController.log('info', message, content)
        }
    });
}


function sendFailureEmail(to_email, experiment_id, message) {
    let subject = "Project "+experiment_id+" upload failed"
    let text = "Project with id: "+experiment_id+"upload failed"+"\n"
                +"The upload of the giving experiment faild for the following reasons:"+"\n"
                + message +"\n"
                +"You may try again or contact us for further information about the problem" +'\n'
                +"please if needed contact us by replying back!"+"\n"
                +"Thank you,\n BGU team Amit, Liat, Yarin, Haim"
    let mail_options = getMailOptions(to_email, subject, text)
    transporter.sendMail(mail_options, (err, info) => {
        if(err){
            let message = 'Failed to send mail';
            let content = mail_options
            loggerController.log('error', message, content)
        }else{
            let message = 'Email successfully sent';
            let content = {
                envelope: info.envelope,
                messageId: info.messageId
            }
            loggerController.log('info', message, content)
        }
    });
}

function sendContactUs(Name, from_email, subject, message) {
    return new Promise(function (resolve, reject){
        let text = "Client name: "+Name+"\n"+
                    "Client email: "+from_email+"\n"+
                    "Client message: "+message+"\n"
        mail_options = {
            from: process.env.MAILER_EMAIL,
            to: process.env.MAILER_EMAIL,
            subject: subject,
            text: text
        }
        transporter.sendMail(mail_options, (err, info) => {
        if(err){
            let message = 'Failed to send mail';
            let content = mail_options
            loggerController.log('error', message, content)
        }else{
            let message = 'Email successfully sent';
            let content = {
                envelope: info.envelope,
                messageId: info.messageId
            }
            loggerController.log('info', message, content)
        }
    });
    })
}

exports.sendSuccessEmail = sendSuccessEmail
exports.sendFailureEmail = sendFailureEmail
exports.sendContactUs = sendContactUs
