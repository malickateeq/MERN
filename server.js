// Get express server files
const express = require('express');
const connectDB = require("./config/db");

// Initialize express server in a var
const app = express();

// Connect Database
connectDB();

// Registering Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

// Set a port to listen this server OR locally run it over 5000
// This will fetch the PORT number from the environment file.
const PORT = process.env.PORT || 5000;

// Bind our express server with app and listen it to a port.
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});