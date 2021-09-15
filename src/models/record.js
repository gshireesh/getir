const mongoose = require('mongoose')

const schema = mongoose.Schema({
    _id: { type: String, select: false },
    key: { type: String, required: true },
    value: { type: String, select: false },
    createdAt: Date,
    counts: [Number]
})

module.exports = mongoose.model("Records", schema)