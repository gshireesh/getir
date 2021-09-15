require("jest")
const mongoose = require("mongoose")
const ResponseBuilder = require("./response_builder")


// beforeAll(async () => {
//     // Connect to a Mongo DB
//     await mongoose.connect()
// });

test('check success response', () => {
    const resp = new ResponseBuilder()
    resp.success([1,2])
    expect(JSON.stringify(resp)).toBe('{"code":0,"msg":"Success","records":[1,2]}')
})

test('check failure response', () => {
    const resp = new ResponseBuilder()
    resp.error()
    expect(JSON.stringify(resp)).toBe('{"code":1,"msg":"Error"}')
})