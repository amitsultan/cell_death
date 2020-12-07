const path = require('path');
const experiments = require('../routes/experiments')
const script_path = path.join(__dirname,"../../Scripts")

function unArchiveData(input) {
    return new Promise(function (resolve, reject){
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
                reject(err)
            }else{
                if(results.includes('Experiment already exists')){
                    resolve({message : 'Experiment already exists'})
                }else{
                    // new experiment
                    let experiment_id = input.split('.').slice(0, -1).join('.');
                    let date = new Date();
                    console.log('results : ',results)
                    // remove file extension
                    if(input == null){
                        // TODO
                        // Handle file not found (input == null)
                    }else{
                        experiments.createPNGs(input.split('.').slice(0, -1).join('.')).then((results) =>{
                            results.message = 'Images created successfully';
                            resolve(results)
                        }).catch((error) => {
                            reject(error)
                        })
                    }   
                }
            }
        })
    }catch(err){
        reject(err)
    }
  })
}

exports.unArchiveData = unArchiveData