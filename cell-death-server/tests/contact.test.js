const request = require('supertest')
const server = require('../server')

describe("post/administration",()=>{
    test("success to contact us", async () =>{ 
        const response = await request(server).post('/administration/contactUs')
        .send({
            client_name:"test",
            client_email: "test@gmail.com",
            subject: "test",
            message: "test"
        })
        expect(response.statusCode).toBe(200)
        // expect(response).toBe('')
    })

    test("Failed to contact us beacause fields are missing ", async () =>{ 
        const response = await request(server).post('/administration/contactUs')
        .send({
            client_name:"",
            client_email: "test@gmail.com",
            subject: "test",
            message: "test"
        })
        expect(response.statusCode).toBe(500)
    })
})