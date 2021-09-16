require("jest")
require("dotenv").config()
const mongoose = require("mongoose")
const ResponseBuilder = require("./response_builder")
const Record = require("./models/record")
const { expect } = require("@jest/globals")

beforeAll(async () => {
    // Connect to a Mongo DB
    await mongoose.connect(process.env.DB_URL)
});

test('check db fetch response', async () => {
    const count = await Record.count()
    expect(count).toBeGreaterThan(0)
})

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

afterAll(async () => {
    // Connect to a Mongo DB
    await mongoose.disconnect()
});