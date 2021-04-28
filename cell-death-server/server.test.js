import supertest from 'supertest'
import server from './server.js'

describe("post/auth", ()=>
{
    test("success login", async () =>{ 
        const response = await request(server).post('/Login')
        .send({
            email:"",
            password: ""
        })
        expect(response.statusCode).toBe(200)
    })
})