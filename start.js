const app = require('./app')
const mongoose = require('mongoose');

mongoose
	.connect(process.env.DB_URL, {
        useNewUrlParser: false,
        useUnifiedTopology: true
    })
	.then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server has started!")
        })
	}).catch((err) => {
        console.error(err)
    })
