
const path = require('path');
const loggerController = require('./loggerController')
const script_path = path.join(__dirname,"../../Scripts")
const sendMailFleg = 'true'



function sendMail(to_email, subject, text){
    let { PythonShell } = require('python-shell');
    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: script_path,
        // change to 'true' for the emails to be sent
        args: [sendMailFleg, process.env.MAILER_EMAIL, process.env.MAILER_PASSWORD, to_email, subject, text]
    };
    try{
        PythonShell.run('MailSender.py', options, function (err, results){
            if(err){
                let message = 'Failed to send mail-python shell';
                // let content = mail_options
                loggerController.log('error', err)
            }
            else{
                let message = 'Email successfully sent';
                // let content = {
                //     envelope: results.envelope,
                //     messageId: results.messageId
                // }
                loggerController.log('info', message)
            }
        })
    }
    catch(err)
    {
        let message = 'Failed to send mail-try catch';
        // let content = mail_options
        loggerController.log('error', message)
    }   
}

function sendSuccessEmail(to_email, experiment_id) {
    let subject = "Project "+experiment_id+" uploaded successfully"
    let text = "Project with id: "+experiment_id+" uploaded successfully"+'\n'+
                "You can view it under experiments in the website and begin the tagging process,"+"\n"+
                "if any problems occur please contact us by replying back!"+"\n"+
                "Thank you,\n BGU team Amit, Liat, Yarin, Haim"
    sendMail(to_email, subject, text)
    
}


function sendFailureEmail(to_email, experiment_id, message) {
    let subject = "Project "+experiment_id+" upload failed"
    let text = "Project with id: "+experiment_id+" upload failed"+"\n"
                +"The upload of the giving experiment faild for the following reasons:"+"\n"
                + message +"\n"
                +"You may try again or contact us for further information about the problem" +'\n'
                +"please if needed contact us by replying back!"+"\n"
                +"Thank you,\n BGU team Amit, Liat, Yarin, Haim"
    sendMail(to_email, subject, text)
}

function sendRegistrationMail(to_email, first_name, last_name) {
    let subject = "Welcome to Cell-Death-Tracking Tool!"
    let text = "Hey, "+ first_name+" "+last_name+"! and welcome to Cell-Death-Tracking Tool"+'\n'
                +"Your registration completed successfully"+'\n'
                +"You now can use your email address and password to login"+'\n'
                +"https://icc.ise.bgu.ac.il/njsw11#/"+'\n'
                +"please if needed contact us by replying back!"+"\n"
                +"Thank you,\n BGU team Amit, Liat, Yarin, Haim"

    sendMail(to_email, subject, text)
}

function sendContactUs(Name, from_email, subject, message) {
    return new Promise(function (resolve, reject){
        let text = "Client name: "+Name+"\n"+
                    "Client email: "+from_email+"\n"+
                    "Client message: "+message+"\n"
        sendMail(process.env.MAILER_EMAIL, subject, text)
        
    })
}

exports.sendSuccessEmail = sendSuccessEmail
exports.sendFailureEmail = sendFailureEmail
exports.sendContactUs = sendContactUs
exports.sendRegistrationMail = sendRegistrationMail
