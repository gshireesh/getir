const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const router = require('./src/routes')
require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
    }));

app.use(bodyParser.json())

app.use('/api/v1', router)


module.exports = app
