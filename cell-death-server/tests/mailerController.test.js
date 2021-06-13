const controller = require('../controllers/mailerController.js')


describe("tests for mail controller", ()=>{
    test("SUCCESS: send email",async ()=>{
        let results = await controller.sendMail("", "", "")
        console.log(results)
    })
})