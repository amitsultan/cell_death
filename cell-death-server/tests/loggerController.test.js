const controller  = require("../controllers/loggerController")
const fs = require("fs")
var logsPath = "./logs/"

function countLines(path){
    return new Promise((resolve) => {
        var count = 0;
        fs.createReadStream(path)
        .on('data', function(chunk) {
            for (i=0; i < chunk.length; ++i)
                if (chunk[i] == 10) count++;
        })
        .on('end', function() {
            resolve(count)
        });

    }) 
    
}

describe("tests for log", ()=>{
    test("log info successfuly", async ()=>{
        let before = await countLines(logsPath+"combined.log")
        await controller.log("info", "test", {"test": "test"})
        let afer = await countLines(logsPath+"combined.log")
        expect(afer).toBe(before+1)

    })
    test("log error successfuly", async ()=>{
        let beforeE = await countLines(logsPath+"error.log")
        let beforeC = await countLines(logsPath+"combined.log")
        await controller.log("error", "test", {"test": "test"})
        let aferE = await countLines(logsPath+"error.log")
        let aferC = await countLines(logsPath+"combined.log")
        expect(aferE).toBe(beforeE+1)
        expect(aferC).toBe(beforeC+1)
    })
    test("log error failure - no level", async ()=>{
        let before = await countLines(logsPath+"combined.log")
        await controller.log("", "test", {"test": "test"})
        let afer = await countLines(logsPath+"combined.log")
        expect(afer).toBe(before)
    })
    test("log error failure - no message, no content", async ()=>{
        let before = await countLines(logsPath+"error.log")
        await controller.log("error", "",)
        let afer = await countLines(logsPath+"error.log")
        expect(afer).toBe(before+1)
    })
})