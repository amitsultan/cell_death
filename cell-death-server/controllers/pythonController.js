const path = require('path');
const experiments = require('../routes/experiments')
const script_path = path.join(__dirname,"../../Scripts")

function unArchiveData(input) {
    let { PythonShell } = require('python-shell');
    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: script_path,
        args: [input]
    };
    try{
        PythonShell.run('file_preperations.py', options, function (err, results) {
            if(err){
                console.log(err)
            }else{
                // remove file extension
                experiments.createPNGs(input.split('.').slice(0, -1).join('.')).then(() =>{
                    // Track_mate can run here
                    console.log('pngs done')
                }).catch((error) => {
                    console.log(error)
                })
                console.log(results)
            }
        })
    }catch(err){
        console.log(err)
    }
}

exports.unArchiveData = unArchiveData