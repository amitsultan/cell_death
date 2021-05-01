const request = require('supertest')
const app = require('../server')

describe("tests for profile route", ()=>{
    test("get profile success",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({userId: 1})
        expect(response.statusCode).toBe(200)
        expect(response.type).toBe("application/json")
    })
    test("get profile faliure - no user id",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({})
        expect(response.statusCode).toBe(500)
    })
    test("get profile faliure - user without experiments",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({userId: 2})
        expect(response.statusCode).toBe(400)
    })

    test("get User Id By Email sucess",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email: 'test@test.com'})
        expect(response.statusCode).toBe(200)
        expect(response.type).toBe("application/json")

    })
    test("get User Id By Email faliure - no email",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({})
        expect(response.statusCode).toBe(500)
    })
    test("get User Id By Email faliure - email not found",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email:"hdhdhd@gmail.com"})
        expect(response.statusCode).toBe(401)
    })
    test("get User Id By Email faliure - not an email address",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email:"hhhdhdd"})
        expect(response.statusCode).toBe(401)
    })

    test("add Permissions sucess",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'test2@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(200)
    })

    test("add Permissions faliure - no premissions",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '3', email: 'test2@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - no params",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({})
        expect(response.statusCode).toBe(500)
    })
    test("add Permissions faliure - no experiment",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'test2@test.com', projectId: '2021-02'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - no user",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'liat@post.bgu.ac.il', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - alredy in db",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'test1@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - some params missing",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'test1@test.com'})
        expect(response.statusCode).toBe(500)
    })

    test("delete Permissions sucess",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', email: 'test2@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(200)
    })
    test("delete Permissions faliure - not found in db",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', email: 'test1@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no permissions",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '2', email: 'test1@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no experiment",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', email: 'test1@test.com', projectId: 'test1'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no user",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', email: 'test5@test.com', projectId: 'test'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no params",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({})
        expect(response.statusCode).toBe(500)
    })
    test("delete Permissions faliure - some params missing",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', projectId: 'test'})
        expect(response.statusCode).toBe(500)
    })

})