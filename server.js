// Get express server files
const express = require('express');
const connectDB = require("./config/db");

// Initialize express server in a var
const app = express();

// Connect Database
connectDB();

// An end-point for testing.
app.get('/', (req, res) => res.send("API running"));

// Set a port to listen this server OR locally run it over 5000
// This will fetch the PORT number from the environment file.
const PORT = process.env.PORT || 5000;

// Bind our express server with app and listen it to a port.
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});