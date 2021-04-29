const request = require('supertest')
const app = require('../server')

describe("tests for profile route", ()=>{
    test("get profile success",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({userId: 10})
        expect(response.statusCode).toBe(200)
        expect(response.type).toBe("application/json")
    })
    test("get profile faliure",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({})
        expect(response.statusCode).toBe(500)
    })
    test("get profile faliure",async ()=>{
        const response = await request(app).post('/profile/getProfile').send({userId: 1})
        expect(response.statusCode).toBe(400)
    })

    test("get User Id By Email sucess",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email: 'liatico77@gmail.com'})
        expect(response.statusCode).toBe(200)
        expect(response.type).toBe("application/json")

    })
    test("get User Id By Email faliure - no email",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({})
        expect(response.statusCode).toBe(500)
    })
    test("get User Id By Email faliure - email not found",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email: 'lijfjdkd@gmail.com'})
        expect(response.statusCode).toBe(401)
    })
    test("get User Id By Email faliure - not an email address",async ()=>{
        const response = await request(app).post('/profile/getUserIdByEmail').send({email: 'lijfjdkd'})
        expect(response.statusCode).toBe(401)
    })

    test("add Permissions sucess",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '10', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(200)
    })

    test("add Permissions faliure - no premissions",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '1', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - no params",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({})
        expect(response.statusCode).toBe(500)
    })
    test("add Permissions faliure - no experiment",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '10', email: 'aaa@post.bgu.ac.il', projectId: '2021-02'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - no user",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '10', email: 'liat@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(400)
    })
    test("add Permissions faliure - alredy in db",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '10', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(500)
    })
    test("add Permissions faliure - some params missing",async ()=>{
        const response = await request(app).post('/profile/addPermissions')
        .send({user_id: '10', email: 'liatco@post.bgu.ac.il'})
        expect(response.statusCode).toBe(500)
    })

    test("delete Permissions sucess",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '10', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(200)
    })
    test("delete Permissions faliure - not found in db",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '10', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no permissions",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '1', email: 'liatco@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no experiment",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '10', email: 'aaa@post.bgu.ac.il', projectId: '2021-02'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no user",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '10', email: 'aaaaaa@post.bgu.ac.il', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(400)
    })
    test("delete Permissions faliure - no params",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({})
        expect(response.statusCode).toBe(500)
    })
    test("delete Permissions faliure - some params missing",async ()=>{
        const response = await request(app).post('/profile/deletePermissions')
        .send({user_id: '10', projectId: '2021-02-05'})
        expect(response.statusCode).toBe(500)
    })

})