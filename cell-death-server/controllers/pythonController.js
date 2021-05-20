const { content } = require('googleapis/build/src/apis/content');
const path = require('path');
const experiments = require('../routes/experiments')
const script_path = path.join(__dirname,"../../Scripts")
var sizeOf = require('image-size');
const fs = require("fs");

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
                // console.log(results)
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

function runStarDist(inputPath, experimentId, outputPath)
{
    console.log(inputPath)
    console.log(outputPath)
    return new Promise((resolve, reject)=>{
        let { PythonShell } = require('python-shell');
        let options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: script_path,
            args: [inputPath, experimentId, outputPath]
        };
        try
        {
            PythonShell.run('starDist/trackingTool.py', options, async function (err, results){
                if(err){
                    console.log(err)
                    reject(err)
                }
                else{
                    resolve(results)      
                }
            })
        }
        catch(error)
        {
            reject(error)
        }
    })
}

// exports.runTrackMate = runTrackMate
exports.unArchiveData = unArchiveData
exports.convertTifToPng = convertTifToPng
exports.runStarDist = runStarDist
