const { content } = require('googleapis/build/src/apis/content');
const path = require('path');
const experiments = require('../routes/experiments')
const script_path = path.join(__dirname,"../../Scripts")

function unArchiveData(input, extension) {
    return new Promise(function (resolve, reject){
    let { PythonShell } = require('python-shell');
    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: script_path,
        args: [input, extension]
    };
    try{
        console.log(options.args)
        PythonShell.run('file_preperations.py', options, function (err, results) {
            if(err){
                reject(err)
            }else{
                console.log('results: '+results)
                if(results.includes('Experiment already exists')){
                    resolve({message : 'Experiment already exists'})
                }else{
                    // new experiment
                    let experiment_id = input.split('.').slice(0, -1).join('.');
                    let date = new Date();
                    // remove file extension
                    if(input == null){
                        // TODO
                        // Handle file not found (input == null)
                    }else{
                        console.log("before PNGS\n\n\n");
                        experiments.createPNGs(input.split('.').slice(0, -1).join('.'), extension).then((results) =>{
                            results.message = 'Images created successfully';
                            resolve(results)
                        }).catch((error) => {
                            console.log(error)
                            reject(error)
                        })
                    }   
                }
            }
        })
    }catch(err){
        console.log(err)
        reject(err)
    }
  })
}


exports.unArchiveData = unArchiveData