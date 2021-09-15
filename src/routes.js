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

    const query = {}
    
    if (startDate) {
        query.createdAt = query.createdAt || {}
        query.createdAt['$gte'] = new Date(startDate)
    }
    if (endDate) {
        query.createdAt = query.createdAt || {}
        query.createdAt['$lt'] = new Date(endDate)
    }

    if (minCount) {
        query.totalCount = query.totalCount || {}
        query.totalCount['$gte'] = minCount
    }

    if (maxCount) {
        query.totalCount = query.totalCount || {}
        query.totalCount['$lt'] = maxCount
    }
    response = new ResponseBuilder()
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