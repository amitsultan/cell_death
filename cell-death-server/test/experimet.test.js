const request = require('supertest')
const {app} = require('../server.js')
const server = require('../server.js')
const experiments = require('../routes/experiments.js')
const experss = request('express')
const fs = require('fs')
const m_path = require("path");
const DButils = require("../DB/DButils");
const mailController = require('../controllers/mailerController')
const loggerController = require('../controllers/loggerController')
const csvEditorController = require('../controllers/csvEditorController')
const projectController = require('../controllers/projectController')
const { call } = require('tiff-to-png')
var {uploadProjectHandler} = require('../handlers/experiments.js') 
const { Http2ServerResponse } = require('http2')

let experimend_id = '2021-02-05'
let frame_number = '1'
let rows = [{id:0,x:10,y:10,frame:1,type:1}]
let mock_value = 'hi'
let mock_error = jest.fn(async function(){throw 'error'})
let mock_error_sync = jest.fn(function(){throw 'error'})
let mock_empty_func = jest.fn()
let mock_false = jest.fn(function(){return false})
let mock_true = jest.fn(function(){return true})

describe("/getImageById/:experimentId/:imageId", ()=>
{
    console.log = mock_empty_func

    test("get image frame 1 from 2021-02-05", async () =>{ 
        const response = await request(server)
        .get('/experiments/getImageById/2021-02-05/1')
        .send()
        expect(response.text).toBe(undefined)
        expect(response.statusCode).toBe(200)
    })
    test("bad request - missing parameter imageId", async () =>{ 
        const response = await request(server)
        .get('/experiments/getImageById/2021-02-05/')
        .send()
        expect(response.statusCode).toBe(404)
    })
    test("files already exist", async () =>{ 
        // mock the existsSync functino in fs
        fs.existsSync = mock_false
        const response = await request(server)
        .get('/experiments/getImageById/2021-02-05/1')
        .send()
        console.log(response.text)
        expect(response.statusCode).toBe(500)// TODO: should be 200
    })
    test("create new files", async () =>{ 
        // mock the existsSync functino in fs
        fs.existsSync = mock_true
        const response = await request(server)
        .get('/experiments/getImageById/2021-02-05/1')
        .send()
        console.log(response.text)
        expect(response.statusCode).toBe(200)
    })
})
describe("/getDetails/:experimentId", ()=>
{
    console.log = mock_empty_func

    test("bad request - missing parameter experimentId", async () =>{ 
        const response = await request(server)
        .get('/experiments/getDetails/')
        .send()
        expect(response.statusCode).toBe(404)
    })
    test("get details of non-existent experiment", async () =>{ 
        // mock the experimentDetails functioמ to simulate experiment noא found in db
        DButils.experimentDetails = jest.fn(async function(){return []})
        const response = await request(server)
        .get('/experiments/getDetails/non-existent-experiment')
        .send() 
        console.log(response.text)
        expect(response.statusCode).toBe(404)
    })
    test("get details of existent experiment", async () =>{ 
        // mock the experimentDetails functioמ to simulate experiment found in db
        DButils.experimentDetails = jest.fn(async function(){return ['experimentID']})
        const response = await request(server)
        .get('/experiments/getDetails/validExperimentID')
        .send() 
        console.log(response.text)
        expect(response.statusCode).toBe(200)
    })
    test("db error", async () =>{ 
        // mock the experimentDetails functinno to simulate experiment no found in db
        DButils.experimentDetails = mock_error
        const response = await request(server)
        .get('/experiments/getDetails/experiment')
        .send() 
        console.log(response.text)
        expect(response.statusCode).toBe(500)
    })
})


// router.get("/getExperiments", async (req, res) => {
//     try {
//       const directories_names = getDirectories(dataDirectory);
//       let results = []
//       for await (directory of directories_names) {
//         if(!directory.endsWith("_SC")){
//           results.push(directory)
//         }
//       }
//       res.status(200).send(results);
//     } catch (error) {
//       console.log(error)
//       res.status(500).send("Unable to load experiments");
//     }
//   });

// describe("/getExperiments", ()=>
// {
//         // 500 text: Unable to get csv data
//         // mock the loggerController
//         loggerController.log = mock_empty_func
//         test("get experiments from DB", async () =>{ 
//             // mock the csvEditorController
//             csvEditorController.getCsvRowsByFrame = jest.fn(async function(){return rows})
//             const response = await request(server).get("/experiments/getExperiments").send()
//             console.log(response.body)
//             expect(response.statusCode).toBe(200)
//         })
//         test("exeption while getting experiments", async () =>{ 
//             // mock the csvEditorController
//             const push = Array.push
//             Array.push = jest.fn().mockReturnValue(0)
//             // csvEditorController.getCsvRowsByFrame = jest.fn(async function(){return rows})
//             const response = await request(server).get("/experiments/getExperiments").send()
//             console.log("exeption while getting experiments")
//             expect(response.statusCode).toBe(500)
//             Array.push = push
//         })
// })

describe("/updateCsvDataById/:experiment_name/:frame_number", ()=>
{
    // console.log = mock_empty_func
    test("update frame 1 in experiment '2021-02-05'", async () =>{ 
        // mock the loggerController
        loggerController.log = mock_empty_func
        // mock the csvEditorController
        csvEditorController.editCsvFrame = jest.fn(async function(){return mock_value})
        const response = await request(server)
        .post('/experiments/updateCsvDataById/'+experimend_id+'/'+frame_number)
        .send({rows:rows})
        expect(response.text).toBe('marks updated for frame: 1')
        expect(response.statusCode).toBe(200)
    })
    test("update frame in non-existent experiment", async () =>{ 
        // mock the loggerController
        loggerController.log = mock_empty_func        
        // chage the editCsvFrame mock to simulate error from db
        csvEditorController.editCsvFrame = mock_error
        const response = await request(server)
        .post('/experiments/updateCsvDataById/non-existent-experiment/'+frame_number)
        .send({rows:rows})
        expect(response.text).toBe('Unable to get csv data') // shouldnt be 'marks updated for frame: 1'
        expect(response.statusCode).toBe(500) // should be 404 or 500
    })
    test("update invalid frame -10 in experiment '2021-02-05'", async () =>{ 
        // mock the loggerController
        loggerController.log = mock_empty_func
        // chage the editCsvFrame mock to simulate error from db
        csvEditorController.editCsvFrame = mock_error
        const response = await request(server)
        .post('/experiments/updateCsvDataById/'+experimend_id+'/-10')
        .send({rows:rows})
        expect(response.text).toBe('Unable to get csv data')// shouldnt be 'marks updated for frame: -10'
        expect(response.statusCode).toBe(500)// should be 500
    })
    test("exeption while updating csv", async () =>{ 
        // mock the loggerController to throw exception
        loggerController.log = mock_error_sync
        // chage the editCsvFrame mock to throw exception
        csvEditorController.editCsvFrame = mock_error_sync
        const response = await request(server)
        .post('/experiments/updateCsvDataById/'+experimend_id+'/1')
        .send({rows:rows})
        expect(response.text).toBe('{\"success\":false}')// shouldnt be 'marks updated for frame: 1'
        expect(response.statusCode).toBe(500)// should be 500
    })
})

describe("/uploadProject", ()=>
{
    console.log = mock_empty_func

    test("upload a file while not logged in", async () =>{ 
        // mock the loggerController
        loggerController.log = mock_empty_func
        // mock the csvEditorController
        csvEditorController.editCsvFrame = jest.fn(async function(){return 'mock value'})
        // mock the mailer
        mailController.sendFailureEmail = mock_empty_func
        // mock the DButils
        DButils.addPremissions = mock_empty_func
        // mock project controller
        projectController.isExperimentExists = jest.fn(() => true)
        projectController.extractRar = mock_empty_func
        projectController.addProjectToDB = mock_empty_func
        const response = await request(server).post("/experiments/uploadProject",{session:{userID:'1'}}).send()//mock_req
        expect(response.body.msg).toBe('User must be logged in')
    })
    test("bad request", async () =>{ 

        // mock the loggerController
        loggerController.log = mock_empty_func
        // mock the csvEditorController
        csvEditorController.editCsvFrame = jest.fn(async function(){return 'mock value'})
        // mock the mailer
        mailController.sendFailureEmail = mock_empty_func
        // mock the DButils
        DButils.addPremissions = mock_empty_func
        // mock project controller
        projectController.isExperimentExists = jest.fn(() => true)
        projectController.extractRar = mock_empty_func
        projectController.addProjectToDB = mock_empty_func
        const response = await request(server).post("/experiments/uploadProject").send({/*empty request*/})//mock_req
        expect(response.body.msg).toBe('User must be logged in')
        expect(response.statusCode).toBe(500)
    })
    test("upload a file while logged in", async () =>{ 
        uploadProjectHandler = jest.fn(uploadProjectHandler({session:{userID:'1'},files:undefined},
            {
                status: function(number){this.status = number} 
            })
        )
        loggerController.log = jest.fn()
        // mock the csvEditorController
        csvEditorController.editCsvFrame = jest.fn(async function(){return 'mock value'})
        // mock the mailer
        mailController.sendFailureEmail = mock_empty_func
        // mock the DButils
        DButils.addPremissions = mock_empty_func
        // mock project controller
        projectController.isExperimentExists = jest.fn(() => true)
        projectController.extractRar = mock_empty_func
        projectController.addProjectToDB = mock_empty_func
        // const response = await request(server).post("/experiments/uploadProject").send()
        // expect(response.body.msg).toBe('file is not found')
        // expect(response.statusCode).toBe(500)
        // uploadProjectHandler = backup_uploadProjectHandler
        // uploadProjectHandler = jest.fn(backup_uploadProjectHandler)
    })
})
describe("/getCsvDataById/:experimentId/:frameId", ()=>
{
    // console.log = mock_empty_func

    // 500 text: Unable to get csv data
    // mock the loggerController
    loggerController.log = mock_empty_func
    test("get csv data for frame  1 in experiment '2021-02-05'", async () =>{ 
        // mock the csvEditorController
        // let backup_getCsvRowsByFrame = getCsvRowsByFrame
        csvEditorController.getCsvRowsByFrame = jest.fn(async function(){return rows})
        const response = await request(server).get("/experiments/getCsvDataById/2021-02-05/1").send()
        expect(response.statusCode).toBe(200)
        // csvEditorController = backup_getCsvRowsByFrame
    })
    test("bad request", async () =>{ 
        // mock the csvEditorController
        csvEditorController.getCsvRowsByFrame = jest.fn(async function(){return rows})
        const response = await request(server).get("/experiments/getCsvDataById//").send()
        expect(response.statusCode).toBe(404)
    })
    test("get csv data for frame  1 in a non-existent experiment", async () =>{ 
        // mock the csvEditorController
        csvEditorController.getCsvRowsByFrame = mock_error
        const response = await request(server).get("/experiments/getCsvDataById/non-existent-experiment/1").send()
        expect(response.text).toBe("Unable to get marks data")
        expect(response.statusCode).toBe(500)
    })
    test("get csv data for frame  -10 in experiment '2021-02-05'", async () =>{ 
        // mock the csvEditorController
        csvEditorController.getCsvRowsByFrame = mock_error
        const response = await request(server).get("/experiments/getCsvDataById/2021-02-05/-10").send()
        expect(response.text).toBe("Unable to get marks data")
        expect(response.statusCode).toBe(500)
    })
})

// router.get("/experimentCSV/:experimentId", (req, res) => {
//     try{
//       let data_path = "../data/"
//       let experiment_id = req.params.experimentId
//       if(!experiment_id){
//         loggerController.log('error','experimentCSV: No experiment ID folder', {experiment_id: experiment_id, error:err})
//         res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
//       }else{
//         let m_path = require("path");
//         let path = m_path.resolve(data_path + experiment_id + "/" + experiment_id +".csv")
//         console.log(path)
//           fs.readFile(path, 'utf8', function (err,data) {
//             if (err) {
//               console.log(err)
//               loggerController.log('error','experimentCSV: Failed to read file', {experiment_id: experiment_id, error:err})
//               res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
//             }else{
//               console.log("else")
//               res.setHeader('Content-disposition', 'attachment; filename='+experiment_id+'.csv');
//               res.set('Content-Type', 'text/csv');
//               res.status(200).send(data);
//             }
//           });
//       }
//     }catch(err){
//       loggerController.log('error','experimentCSV: Unexcpeted error', {experiment_id: experiment_id, error:err})
//       res.status(500).send("Unable to get csv file for experiment: "+experiment_id);
//     }
//   });
describe("/experimentCSV/:experimentId", ()=>
{
    // console.log = mock_empty_func
    // mock the loggerController
    loggerController.log = mock_empty_func
    test("path not found to csv", async () =>{ 
        let readFile = fs.readFile
        fs.readFile = mock_error_sync
        const response = await request(server).get("/experiments/experimentCSV/existent_experiment").send()
        expect(response.text).toBe("Unable to get csv file for experiment: existent_experiment")
        expect(response.statusCode).toBe(500)
        fs.readFile = readFile
    })
    test("bad request", async () =>{ 
        // mock the csvEditorController
        csvEditorController.getCsvRowsByFrame = jest.fn(async function(){return rows})
        const response = await request(server).get("/experiments/experimentCSV/").send()
        expect(response.statusCode).toBe(404)
    })
    test("error reading csv", async () =>{ 
        const response = await request(server).get("/experiments/experimentCSV/existent_experiment").send()
        expect(response.text).toBe("Unable to get csv file for experiment: existent_experiment")
        expect(response.statusCode).toBe(500)
    })
    test("get csv for non-existent experiment", async () =>{ 
        // mock the csvEditorController
        csvEditorController.getCsvRowsByFrame = mock_error
        const response = await request(server).get("/experiments/experimentCSV/non-existent-experiment").send()
        expect(response.text).toBe("Unable to get csv file for experiment: non-existent-experiment")
        expect(response.statusCode).toBe(500)
    })
})
 
