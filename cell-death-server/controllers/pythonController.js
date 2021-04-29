const path = require('path');
const experiments = require('../routes/experiments')
const script_path = path.join(__dirname,"../../Scripts")
var sizeOf = require('image-size');
const fs = require("fs");

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
                // console.log(results)
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
                        console.log("before PONGS\n\n\n");
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
function runTrackMate(exp_id){
    return new Promise(function (resolve, reject){
        let { PythonShell } = require('python-shell');
        let options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: script_path,
            args: [exp_id]
        };
    try{
        //run trackmete script
        PythonShell.run('trackmate.py', options, function (err, results) {
            if(err){
                reject(err);
            }
            else{
                results.message = "Experiment processed successfully";
            }
        })
    }catch(err){
        results.message("Could not run trackmate");
    }
    })
}

function convertTifToPng(inputPath, outputPath){
    return new Promise((resolve, reject)=>{
        let { PythonShell } = require('python-shell');
        let options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: script_path,
            args: [inputPath, outputPath]
        };
        try
        {
            PythonShell.run('convert_tif_to_png.py', options, async function (err, results){
                if(err){
                    reject(err)
                }
                else{
                    var files = fs.readdirSync(outputPath);
                    let file = files[1]
                    let width = 0
                    let height = 0
                    try
                    {
                        dimensions = await sizeOf(outputPath + file)
                        width = dimensions.width;
                        height = dimensions.height;
                        
                        let images_details = {
                            num_pictures: files.length,
                            width: width,
                            height: height
                        }
                        resolve(images_details)
                    }
                    catch(err)
                    {
                        reject("Couldn't fetch image dimensions")
                    }
                            
                }
            })
        }
        catch(error)
        {
            reject(error)
        }
    })
}

exports.runTrackMate = runTrackMate
exports.unArchiveData = unArchiveData
exports.convertTifToPng = convertTifToPng