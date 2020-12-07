const fs = require("fs");
const csv = require('csv-parser');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;


function editCsvFrame(path , marks, frame){
    return new Promise(function (resolve, reject){
        if(!marks){
            reject({error: "Marks is undifined"})
        }else{
            getCsvRowsExceptFrame(path, frame).then((results)=>{
                marks = marks.concat(results)
                const csvWriter = createCsvWriter({
                    path: path,
                    header: [
                        {id: 'id', title: 'id'},
                        {id: 'x', title: 'x'},
                        {id: 'y', title: 'y'},
                        {id: 'frame', title: 'frame'},
                        {id: 'type', title: 'type'},
                    ]
                });
                csvWriter.writeRecords(marks)
                .then(()=>{
                    resolve('updated marks')
                }).catch((error)=>{
                    reject(error)
                });
            }).catch((error)=>{
                reject(error)
            })
        }
    })
}

/**
 * Get all rows from csv excluding a certain frame
 */
function getCsvRowsExceptFrame(path, frame){
    return new Promise(function (resolve, reject){
        let marks = []
        try{
            if (fs.existsSync(path)) {
                fs.createReadStream(path)
                .pipe(csv())
                .on('data', (row) => {
                    if(row.frame != frame){
                        marks.push(row)
                    }
                })
                .on('end', () => {
                    resolve(marks)
                })
                .on('error', (error)=>{
                    reject(error)
                })
            }else{
                resolve(marks)
            }
        }catch(error){
            resolve(error)
        }
    })
}

function getCsvRowsByFrame(path, frame){
    return new Promise(function (resolve, reject){
        let marks = []
        try{
            if (fs.existsSync(path)) {
                fs.createReadStream(path)
                .pipe(csv())
                .on('data', (row) => {
                    if(row.frame == frame){
                        marks.push(row)
                    }
                })
                .on('end', () => {
                    resolve(marks)
                })
                .on('error', (error)=>{
                    reject(error)
                })
            }else{
                resolve(marks)
            }
        }catch(error){
            resolve(error)
        }
    })
}


exports.editCsvFrame = editCsvFrame
exports.getCsvRowsByFrame = getCsvRowsByFrame