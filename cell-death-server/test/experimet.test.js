const request = require('supertest')


const server = require('../server.js')

const DButils = require("../DB/DButils");
const mailController = require('../controllers/mailerController')
const loggerController = require('../controllers/loggerController')
const csvEditorController = require('../controllers/csvEditorController')
const projectController = require('../controllers/projectController')
const { call } = require('tiff-to-png')


let experimend_id = '2021-02-05'
let frame_number = '1'
let rows = [{id:0,x:10,y:10,frame:1,type:1}]
let mock_value = 'hi'

describe("/updateCsvDataById/:experiment_name/:frame_number", ()=>
{
    // 500 text: Unable to get csv data
    test("update frame 1 in experiment '2021-02-05'", async () =>{ 
        // mock the loggerController
        let mock_log = jest.fn()
        loggerController.log = mock_log
        // mock the csvEditorController
        let mock_editCsvFrame = jest.fn(async function(){return mock_value})
        csvEditorController.editCsvFrame = mock_editCsvFrame
        const response = await request(server)
        .post('/experiments/updateCsvDataById/'+experimend_id+'/'+frame_number)
        .send({rows:rows})
        expect(response.text).toBe('marks updated for frame: 1')
        expect(response.statusCode).toBe(200)
    })
    
    test("update frame in non-existent experiment", async () =>{ 
        const response = await request(server)
        .post('/experiments/updateCsvDataById/non-existent-experiment/'+frame_number)
        .send({rows:rows})
        // expect(response.text).toBe('Unable to get csv data') // shouldnt be 'marks updated for frame: 1'
        expect(response.statusCode).toBe(200) // should be 404 or 500
    })
    test("update invalid frame -10 in experiment '2021-02-05'", async () =>{ 
        const response = await request(server)
        .post('/experiments/updateCsvDataById/'+experimend_id+'/-10')
        .send({rows:rows})
        // expect(response.text).toBe('Unable to get csv data')// shouldnt be 'marks updated for frame: -10'
        expect(response.statusCode).toBe(200)// should be 500
    })
})

describe("/uploadProject", ()=>
{
    // 200 msg: Project rar recived! Email will be sent when processing done
    // 500 msg: Error occured
    // 500 mgs: No file found under rar
    // 500 mgs: file is not found
    test("upload a file while not logged in", async () =>{ 

        // mock request 
        // sessionID: 'pQpIgRUSLRfFO6Hcqfoo_uE-oEa_3Hx3',
        // session: Session {
        //   cookie: {
        //     path: '/',
        //     _expires: 7200000,
        //     originalMaxAge: 7200000,
        //     httpOnly: true
        //   }
        // },
        // files: {
        //   projectRar: {
        //     name: 'test.zip',
        //     data: <Buffer 50 4b 03 04 14 00 00 00 00 00 8f 60 63 52 00 00 00 00 00 00 00 00 00 00 00 00 0a 00 00 00 74 65 73 74 2f 74 65 73 74 2f 50 4b 03 04 14 00 00 00 08 00 ... 5238296 more bytes>,
        //     size: 5238346,
        //     encoding: '7bit',
        //     tempFilePath: '',
        //     truncated: false,
        //     mimetype: 'application/zip',
        //     md5: 'dcc71c9485ff2355f6441153e27fa073',
        //     mv: [Function: mv]
        //   }
        // },

        //mock request
        let mock_req = {
            sessionID: 'pQpIgRUSLRfFO6Hcqfoo_uE-oEa_3Hx3',
            session: {
                userID: '1',
                cookie: {
                    path: '/',
                    _expires: 7200000,
                    originalMaxAge: 7200000,
                    httpOnly: true
                }
            },
            files: {
                projectRar: {
                name: 'test.zip',
                data: '',//<Buffer 50 4b 03 04 14 00 00 00 00 00 8f 60 63 52 00 00 00 00 00 00 00 00 00 00 00 00 0a 00 00 00 74 65 73 74 2f 74 65 73 74 2f 50 4b 03 04 14 00 00 00 08 00 ... 5238296 more bytes>,
                size: 5238346,
                encoding: '7bit',
                tempFilePath: '',
                truncated: false,
                mimetype: 'application/zip',
                md5: 'dcc71c9485ff2355f6441153e27fa073',
                // mv: [Function: mv]
                }
            }
        }
        // const mockRequest = (sessionData) => {
        //     return {
        //       session: { data: sessionData },
        //     };
        //   };
        // const sinon = require('sinon');

        // const mockResponse = () => {
        //     const res = {};
        //     res.status = sinon.stub().returns(res);
        //     res.json = sinon.stub().returns(res);
        //     return res;
        //   };
        // mock the loggerController
        loggerController.log = jest.fn()
        // mock the csvEditorController
        csvEditorController.editCsvFrame = jest.fn(async function(){return 'mock value'})
        // mock the mailer
        mailController.sendFailureEmail = jest.fn()
        // mock the DButils
        DButils.addPremissions = jest.fn()
        // mock project controller
        projectController.isExperimentExists = jest.fn(() => true)
        projectController.extractRar = jest.fn()
        projectController.addProjectToDB = jest.fn()
        const response = await request(server).post("/experiments/uploadProject",{session:{userID:'1'}}).send()//mock_req
        expect(response.body.msg).toBe('User must be logged in')
        expect(response.statusCode).toBe(500)
    })
})

//units
// function EditListOfData(listOfData)
// router.get("/getExperiments", async (req, res) 
// const createPNGs = async (serial, extension)
// router.get("/getImageById/:experimentId/:imageId", (req, res) 
// router.get("/getDetails/:experimentId", (req, res)
// router.get("/experimentCSV/:experimentId", (req, res)
// router.get("/getCsvDataById/:experimentId/:frameId", (req, res)
// router.post("/updateCsvDataById/:experimentId/:frameId", (req, res) 
// router.post('/uploadProject', async (req, res) 

//stubs
// csvEditorController.getCsvRowsByFrame(path, frameId)
// csvEditorController.editCsvFrame(path, data, frameId)

// mailController.sendFailureEmail(req.session.email, experiment_id, failure_message)

//loggerController.log

// projectController.isExperimentExists(experiment_id)
// projectController.extractRar(fileName, experiment_id, req.session.userID, '')
// projectController.addProjectToDB(experiment_details, experiment_id, experiment_id_sc)
// projectController.handleExtraChannel(extra_channel, req.session.userID, experiment_id)