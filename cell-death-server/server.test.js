const request = require('supertest')
const app = require('./server')


describe("post/auth", ()=>
{
    test("failed login", async () =>{ 
        const response = await request(app).post('/Login')
        .send({
            email:"",
            password: ""
        })
        expect(response.statusCode).toBe(500)
    })
})

describe("get/experiments", ()=>{
    it("/getImageById/:experimentId/:imageId successfully", async ()=>{
        const response = await request(app).get('/experiments//getImageById/?experimentId="2021-05-02"/?imageId=0')
        .expect('Content-Type', /json/)
    })
})