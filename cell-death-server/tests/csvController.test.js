const controller = require("../controllers/csvEditorController")
const csv = require('csv-parser');
const fs = require('fs');
const csvPath = "./tests/assets/2021-02-05.csv"

function readCsv(path){
    return new Promise((resolve)=>{
        let csvData = []
        fs.createReadStream(path)
        .pipe(csv())
        .on('data', function(csvrow) {
            csvData.push(csvrow);        
        })
        .on('end',function() {
          resolve(csvData)
        });
    })
    
}


describe("test for editCsvFrame", ()=>{
    test("successfull update of csv", async ()=>{
        marks = [{x:5, y:10, frame:0, type:1, id:0},{x:5, y:10, frame:0, type:1, id:1}]
        let records = await readCsv(csvPath)
        var numRowsBefore = records.length
        let results = await controller.editCsvFrame(csvPath, marks, 0)
        records = await readCsv(csvPath)
        expect(records.length).toBe(numRowsBefore+2)
        expect(results).toBe("updated marks")

    })
    test("update of csv failure - no marks", async ()=>{
        try{
            let records = await readCsv(csvPath)
            var numRowsBefore = records.length
            marks = []
            await controller.editCsvFrame(csvPath, marks, 0)
            
        }catch(error){
            records = await readCsv(csvPath)
            expect(records.length).toBe(numRowsBefore)
            expect(error.error).toBe("Marks is undifined")
        }
    })
    test("update of csv failure - no path", async ()=>{
        try{
            marks = [{x:5, y:10, frame:0, type:1, id:0},{x:5, y:10, frame:0, type:1, id:1}]
            await controller.editCsvFrame("", marks, 0)
        }catch(error){
            expect(error)
        }
    })
})
describe("tests for get csv rows by frame", ()=>{
    test("get csv rows suucessfully", async()=>{
        let results = await controller.getCsvRowsByFrame(csvPath, '1')
        expect(results.length).toBe(1)
    })
    test("get csv rows failure - no such frame", async()=>{
        let results = await controller.getCsvRowsByFrame(csvPath, '155')
        expect(results.length).toBe(0)
    })
    test("get csv rows failure - no path", async()=>{
        let results = await controller.getCsvRowsByFrame("", '1')
        expect(results.length).toBe(0)
    })
})