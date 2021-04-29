const request = require('supertest')
const server = require('../server')


describe("post/auth", ()=>
{
    // --------------------------------login tests-----------------------------//
    test("success to login", async () =>{ 
        const response = await request(server).post('/Login')
        .send({
            email:"newtest@gmail.com",
            password: "123456!"
        })
        expect(response.statusCode).toBe(200)
    })

    test("failed to login because one(or more) of the body params is missing", async () =>{ 
        const response = await request(server).post('/Login')
        .send({
            email:"",
            password: "123456!"
        })
        expect(response.statusCode).toBe(500)
    })

    test("failed to login because email is incorrect", async () =>{ 
        const response = await request(server).post('/Login')
        .send({
            email:"error@gmail.com",
            password: "123456!"
        })
        expect(response.statusCode).toBe(401)
    })

    // ------------------------------register tests-----------------------------//
    test("success to register", async () =>{ 
        const response = await request(server).post('/Register')
        .send({
            firstname:"new",
            lastname:"test",
            email:"registerrTest@gmail.com",
            password:"123456!"
        })
        expect(response.statusCode).toBe(200)
    })

    test("failed to register because one or more of the details is missing", async () =>{ 
        const response = await request(server).post('/Register')
        .send({
            firstname:"",
            lastname:"",
            email:"",
            password:""
        })
        expect(response.statusCode).toBe(500)
    })

    test("failed to register because email is already exists", async () =>{ 
        const response = await request(server).post('/Register')
        .send({
            firstname:"a",
            lastname:"a",
            email:"test@gmail.com",
            password:"123456!"
        })
        expect(response.statusCode).toBe(422)
    })


     // -------------------------- get full name by email tests-------------------------// 
    test("success to get full Name by email", async () =>{ 
        const response = await request(server).post('/getFullNameByEmail')
        .send({
            email:"test@gmail.com",
        })
        expect(response.statusCode).toBe(200)
    })
    
    test("fail to get full Name by email because email is incorrect", async () =>{ 
        const response = await request(server).post('/getFullNameByEmail')
        .send({
            email:"",
        })
        expect(response.statusCode).toBe(500)
    })

    //---------------------------- signout test -----------------------------
    test("success to signout", async () =>{ 
        const response = await request(server).post('/signout')
        expect(response.statusCode).toBe(200)
    })    

})