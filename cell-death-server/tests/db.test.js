const db = require('../DB/DButils')

beforeAll(async ()=>{
    //clear db
    await db.execQuery("drop table permissions")
    await db.execQuery("drop table experiments")
    await db.execQuery("drop table users")

    await db.execQuery("CREATE TABLE users ( " +
        "`id` int unsigned NOT NULL AUTO_INCREMENT UNIQUE,"+
        "`first_name` varchar(100) NOT NULL,"+
        "`last_name` varchar(100) NOT NULL,"+
        "`email` varchar(255) UNIQUE NOT NULL,"+
        "`password` varchar(255) NOT NULL,"+
        "PRIMARY KEY (`id`))")
    
    await db.execQuery("CREATE TABLE experiments (" +
       " `experiment_id` varchar(100) UNIQUE NOT NULL,"+
        "`date` DATE,"+
        "`num_pictures` int NOT NULL,"+
        "`width` int NOT NULL,"+
        "`height` int NOT NULL,"+
        "`user_id` int unsigned NOT NULL,"+
        "PRIMARY KEY (`experiment_id`),"+
        "FOREIGN KEY (user_id) REFERENCES users(id))")

    await db.execQuery("CREATE TABLE permissions ("+
        " `user_id` int unsigned NOT NULL, "+
        "`experiment_id` varchar(100) NOT NULL,"+
        "PRIMARY KEY (`user_id`,`experiment_id`),"+
        "FOREIGN KEY (experiment_id) REFERENCES experiments(experiment_id),"+
        "FOREIGN KEY (user_id) REFERENCES users(id))")
})

describe("tests for execQuery", ()=>{
    test("execute successful query select * from users", async ()=>{
        let users = await db.execQuery("select * from users")
        expect(users)
        expect(users.length).toBe(0)
        
    })
    test("execute failure query no query", async ()=>{
        try{
            await db.execQuery("")
        }
        catch(error){
            expect(error)
        }
    })
    test("execute failure query - table not exsits ", async ()=>{
        try{
            await db.execQuery("select * from someLie")
        }
        catch(error){
            expect(error)
        }
    })
})
describe("tests for execRegister", ()=>{
    test("success registration", async ()=>{
        let userDetails = {fname:"test", lname:"test", email:"test@test.com", password:"aA123456!"}
        let results = await db.execRegister(userDetails)
        expect(results.affectedRows).toBe(1)
    })
    test("success registration", async ()=>{
        let userDetails = {fname:"test2", lname:"test2", email:"test2@test.com", password:"aA123456!"}
        let results = await db.execRegister(userDetails)
        expect(results.affectedRows).toBe(1)
    })
    test("success registration", async ()=>{
        let userDetails = {fname:"test3", lname:"test3", email:"test3@test.com", password:"aA123456!"}
        let results = await db.execRegister(userDetails)
        expect(results.affectedRows).toBe(1)
    })
    test("failed registration - already in db", async ()=>{
        try
        {
            let userDetails = {fname:"test", lname:"test", email:"test@test.com", password:"aA123456!"}
            await db.execRegister(userDetails)
        }
        catch(error)
        {
            expect(error)
        }
    })
    test("failed registration - missing arguments, no first name", async ()=>{
        try
        {
            let userDetails = {lname:"test", email:"test@test.com", password:"aA123456!"}
            await db.execRegister(userDetails)
        }
        catch(error)
        {
            expect(error)
        }
    })
    test("failed registration - missing arguments, no detailes", async ()=>{
        try
        {
            let userDetails = {}
            await db.execRegister(userDetails)
        }
        catch(error)
        {
            expect(error)
        }
    })
})
describe("tests for user by email", ()=>{
    test("get user by email successfully", async()=>{
        let user = await db.userByEmail('test@test.com')
        expect(user.length).toBe(1)
        expect(user[0].id).toBe(1)
        expect(user[0].first_name).toBe('test')
    })

    test("get user by email failure - no user with this email", async()=>{
        let user = await db.userByEmail('test1@test.com')
        expect(user.length).toBe(0)
    })
    test("get user by email failure - no email", async()=>{
        let user = await db.userByEmail('')
        expect(user.length).toBe(0)
    })
})
describe("tests for add experiment", ()=>{
    test("add experiment successfully",async()=>{
        let experiment_details  ={experiment_id:"test", num_pictures:10,  date: new Date(), width:10, height:10, user_id: 1}
        let results = await db.addExperiment(experiment_details)
        expect(results.affectedRows).toBe(1) 
             
    })
    test("add experiment failure - alredy in db",async()=>{
        try{
            let experiment_details  ={experiment_id:"test", num_pictures:10,  date: new Date(), width:10, height:10, user_id: 1}
            await db.addExperiment(experiment_details)
        }
        catch(error){
            expect(error) 
        }  
    })
    test("add experiment failure - no heigth and width",async()=>{
        try{
            let experiment_details  ={experiment_id:"test", num_pictures:10,  date: new Date(), width:0, height:0, user_id: 1}
            await db.addExperiment(experiment_details)
        }
        catch(error){
            expect(error.message).toBe("Missing information for experiment")
        }  
    })
    test("add experiment failure - no details",async()=>{
        try{
            await db.addExperiment({})
        }
        catch(error){
            expect(error.message).toBe("Missing information for experiment")
        }    
    })
    test("add experiment failure - no experiment id",async()=>{
        try{
            let experiment_details  ={num_pictures:10,  date: new Date(), width:0, height:0, user_id: 1}
            await db.addExperiment(experiment_details)
        }
        catch(error){
            expect(error.message).toBe("Missing information for experiment")
        }  
    })
})
describe("tests for experiment details", ()=>{
    test("experiment Details success", async()=>{
        let experiment = await db.experimentDetails('test')
        expect(experiment.length).toBe(1)
        expect(experiment[0].experiment_id).toBe('test')
    })
    test("experiment Details failure - experimnt not exists", async()=>{
        try{
            let experiment = await db.experimentDetails('test1')
            expect(experiment.length).toBe(0)

        }catch(error){
            expect(error)
        }
    })
    test("experiment Details failure - no experiment id", async()=>{
        try{
            let experiment = await db.experimentDetails('')
            expect(experiment.length).toBe(0)
        }catch(error){
            expect(error)
            expect(error.message).toBe("Missing information for experiment")
        }

    })
})
describe("tests for add contact request", ()=>{
    test("add contact request success", async ()=>{
        let contact = await db.addContactRequest("test", "test@test.com", "test test", "test test test test")
        expect(contact)
        expect(contact.affectedRows).toBe(1)
    })
    test("add contact request failure - no message", async ()=>{
        try{
            let contact = await db.addContactRequest("test", "test@test.com", "test test", "")
            expect(contact.affectedRows).toBe(0)
        }catch(error){
            expect(error).toBe("Missing fields!")
        }

    })
    test("add contact request failure - no email", async ()=>{
        try{
            let contact = await db.addContactRequest("test", "", "test test", "test test test test")
            expect(contact.affectedRows).toBe(0)
        }catch(error){
            expect(error).toBe("Missing fields!")
        }

    })
})
describe("tests for add permissions", ()=>{
    test("add permissions success", async()=>{
        let results = await db.addPremissions("1", "test")
        expect(results.affectedRows).toBe(1)

    })
    test("add permissions success", async()=>{
        let results = await db.addPremissions("2", "test")
        expect(results.affectedRows).toBe(1)
         
    })
    test("add permissions failure - no user id", async()=>{
        try{
            await db.addPremissions("", "test")
        }catch(error){
            expect(error).toBe("Missing fields!")
        }
    })
    test("add permissions failure - no experiment id", async()=>{
        try{
            await db.addPremissions("2", "")
        }catch(error){
            expect(error).toBe("Missing fields!")
        } 
    })
    test("add permissions failure - no experiment in db", async()=>{
        try{
            await db.addPremissions("2", "test4")
        }catch(error){
            expect(error)
        }
    })
    test("add permissions failure - no user in db", async()=>{
        try{
            await db.addPremissions("5", "test")
        }catch(error){
            expect(error)
        }
    })
})
describe("tests for check for permissions", ()=>{
    test("check for permissions sucess", async ()=>{
        let results = await db.checkForPermissions("1", "test")
        expect(results).toBe(true)
    })
    test("check for permissions failure - no permissions", async ()=>{
        let results = await db.checkForPermissions("2", "test")
        expect(results).toBe(false)
    })
    test("check for permissions failure - no user", async ()=>{
        let results = await db.checkForPermissions("5", "test")
        expect(results).toBe(false)
    })
    test("check for permissions failure - no experiment", async ()=>{
        let results = await db.checkForPermissions("1", "test1")
        expect(results).toBe(false)
    })
    test("check for permissions failure - no experiment and no user", async ()=>{
        let results = await db.checkForPermissions("5", "test1")
        expect(results).toBe(false)
    })
})
describe("tests for get experimetns for user", ()=>{
    test("get experiments for user success", async ()=>{
        let results = await db.getExperimantForUser("1")
        expect(results.length).toBe(1)
        expect(results[0].experiment_id).toBe("test")
    })
    test("get experiments for user success - no experiments", async ()=>{
        let results = await db.getExperimantForUser("3")
        expect(results.length).toBe(0)
    })
    test("get experiments for user success - user not exists", async ()=>{
        let results = await db.getExperimantForUser("5")
        expect(results.length).toBe(0)
    })
})
describe("tests for delete permissions", ()=>{
    test("delete permission success", async() =>{
        let results = await db.deletePremissions("2", "test")
        expect(results).toBe("success!")
    })
    test("delete permission failure - no permissions to delete", async() =>{
        let results = await db.deletePremissions("3", "test")
        expect(results.affectedRows).toBe(0)
    })
    test("delete permission failure - no user", async() =>{
        let results = await db.deletePremissions("5", "test")
        expect(results.affectedRows).toBe(0)
    })
    test("delete permission failure - no experiment", async() =>{
        let results = await db.deletePremissions("1", "test1")
        expect(results.affectedRows).toBe(0)
    })
})
