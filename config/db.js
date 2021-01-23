//  Fetch "mongoose" package files
const mongoose = require('mongoose');

// Get config variables to set up connection
const config = require("config");

// To get the connection string
const db = config.get("mongoURI");

// Create a async / await function to coeect with the database. async / await is the new standard to follow
const connectDB = async () => {
    try
    {
        // await cause mongoose.connect(...) will return a promise
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log("MongoDb Connected...");
    }
    catch(err)
    {
        console.error(err.message);

        // Make the application fail / terminate
        process.exit(1);    // Exit process with failure.
    }
}

module.exports = connectDB;