const express = require("express");
const router = express.Router();
const Record = require('./models/record')
const ResponseBuilder = require('./response_builder')

// to test heartbeat of the server
router.get('ping', function(req, res){
    res.send("pong");
});


/*
    To fetch the records from the db based on the filters passed.
*/

router.post("/records", async (req, res) => {
    // const count = await Record.count()
    // console.log(count)
    const {startDate, endDate, minCount, maxCount} = req.body
    response = new ResponseBuilder()
    const query = {}
    try {
        if (startDate) {
            if (!Date.parse(startDate)) {
                throw new Error("startDate should be Date") 
            }
            query.createdAt = query.createdAt || {}
            query.createdAt['$gte'] = new Date(startDate)
        }
        if (endDate) {
            if (!Date.parse(endDate)) {
                throw new Error("endDate should be Date") 
            }
            date = new Date(endDate)
            if (startDate && query.createdAt['$gte'] > date) {
                throw new Error("startDate shouldnt be greater than endDate") 
            }
            query.createdAt = query.createdAt || {}
            query.createdAt['$lt'] = date
        }

        if (minCount) {
            if (isNaN(minCount)) {
                throw new Error("minCount shouldnt be integer") 
            }
            query.totalCount = query.totalCount || {}
            query.totalCount['$gte'] = minCount
        }

        if (maxCount) {
            if (isNaN(maxCount)) {
                throw new Error("maxCount shouldnt be integer") 
            }
            if (minCount && parseInt(minCount) > parseInt(maxCount)) {
                throw new Error("minCount shouldnt be greater than maxCount") 
            }
            query.totalCount = query.totalCount || {}
            query.totalCount['$lt'] = maxCount
        }
    } catch(err) {
        response.error(err.message)
        res.send(response)
        return
    }
    try {
        const results = await Record.aggregate([
            {
                $project: {
                    totalCount: {$sum: "$counts"},
                    key: 1,
                    createdAt: 1,
                    _id: 0
                }
            },
            {
                $match: query
            }
        ])

        // const records = await Record.find().lean()
        response.success(results)
        
    } catch (err) {
        response.error(err.message)
    } finally {
        res.send(response)
    }
})



module.exports = router