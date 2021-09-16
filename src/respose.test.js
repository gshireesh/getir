require("jest")
const request = require("supertest")
require("dotenv").config()
const mongoose = require("mongoose")
const ResponseBuilder = require("./response_builder")
const Record = require("./models/record")
const { expect } = require("@jest/globals")
const app = require("../app")

beforeAll(async () => {
    // Connect to a Mongo DB
    await mongoose.connect(process.env.DB_URL)
});

test('check db fetch response', async () => {
    const count = await Record.count()
    expect(count).toBeGreaterThan(0)
})

test('check api with invalid date', async () => {
    body = {
        "startDate": "2016-01-26-invalid",
        "endDate": "2018-02-02",
        "minCount": 2891,
        "maxCount": 3000
    }
    const response = await request(app).post("/api/v1/records").send(body)
    expect(response.body.msg).toEqual("Error");
    expect(response.body.error).toEqual("startDate should be Date");
    expect(response.statusCode).toBe(400);
})

test('check api with start and end date where start > end', async () => {
    body = {
        "startDate": "2016-01-26",
        "endDate": "2016-01-25",
        "minCount": 2891,
        "maxCount": 3000
    }
    const response = await request(app).post("/api/v1/records").send(body)
    expect(response.body.msg).toEqual("Error");
    expect(response.body.error).toEqual("startDate shouldnt be greater than endDate");
    expect(response.statusCode).toBe(400);
})

test('check api with min not int', async () => {
    body = {
        "startDate": "2016-01-26",
        "endDate": "2016-01-28",
        "minCount": "123",
        "maxCount": 2890
    }
    const response = await request(app).post("/api/v1/records").send(body)
    expect(response.body.msg).toEqual("Error");
    expect(response.body.error).toEqual("minCount shouldnt be integer");
    expect(response.statusCode).toBe(400);
})

test('check api with min and max count where min > max', async () => {
    body = {
        "startDate": "2016-01-26",
        "endDate": "2016-01-29",
        "minCount": 2891,
        "maxCount": 2890
    }
    const response = await request(app).post("/api/v1/records").send(body)
    expect(response.body.msg).toEqual("Error");
    expect(response.body.error).toEqual("minCount shouldnt be greater than maxCount");
    expect(response.statusCode).toBe(400);
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