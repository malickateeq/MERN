> MERN: MongoDb, Express, React and NodeJs
`magicFunction()`
***
---


# Introduction

- How Js runs on server?
    Node Js + V8 Compiling Engine (written in C++) => to Machine Code.

# Environment
    - VS Code Extensions: ES7 React/Redux/GraphQL/React-Native snippets

# Basics

- Just like in DOM we have window object which has lots of global functions like; setTimeout() we have "global" object in Node js.

# Getting Started

1. Initialize package: `npm init`
Set default `entry point` to `server.js` and go with default values for other.

2. Install Regular Dependencies
- `npm install express express-validator bcryptjs config gravatar jsonwebtoken mongoose request`
* express-validator: For data validation.
* bcryptjs: For password encryption
* config: For global variables
* gravatar: for profile avatars
* jsonwebtoken: JWT token for validations
* mongoose: To interact with the database. A layer to communicate. Just like ORM in laravel.
* request: To make Http requests to another APIs

3. Install Dev Dependencies (Only help/use in development process)
- `npm install -D nodemon concurrently`
* nodemon: Cosntantly watch our server for new changes.
* concurrently: Allow us to run backend express server and frontend react server at the same time.

4. Bootstrapping MERN
Add `server.js` in root folder and add below content

```js
// Get express server files
const express = require('express');

// Initialize express server in a var
const app = express();

// An end-point for testing.
app.get('/', (req, res) => res.send("API running"));

// Set a port to listen this server OR locally run it over 5000
// This will fetch the PORT number from the environment file.
const PORT = process.env.PORT || 5000;

// Bind our express server with app and listen it to a port.
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});
```

5. Start / Run the project
Create custom commands, scripts. In `server.js` scripts

```js
"scripts": {
    "start": "node server", // Wil run on deployment at Horuku
    "server": "nodemon server", // Will run locally
}
```
- Now run `npm run server`  This will fire this script of nodemon "server": "nodemon server",

5. Establish database connection
- Copy / Get connection string from the Mongo Db
- Create a folder in root directory `config`
- Create a file therein `default.json`. The `config` package which we had installed will take make it available globally.
- Put this connection string in `default.json`
```js
{
    "mongoURI": "mongodb+srv://malickateeq:@teeQ7886@devconnector.y3kbb.mongodb.net/<dbname>?retryWrites=true&w=majority"
}
```
- Create a new file `db.js` inside `config` folder.
* Import `moongose`, the package which we've already installed.
```js
//  Fetch "mongoose" package files
const mongoose = require('mongoose');

// Get config variables to set up connection
const config = require("config");
// const { try } = require('bluebird');

// To get the connection string
const db = config.get("mongoURL");

// Create a async / await function to coeect with the database. async / await is the new standard to follow
const connectDB = async () => {
    try
    {
        // await cause mongoose.connect(...) will return a promise
        await mongoose.connect(db, {
            useNewUrlParser: true,
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
```
* Connect to DB in `server.js`
```js
const connectDB = require("./config/db");

// Connect Database
connectDB();

```

# Structuring Project

1. Routes Structure
* Create a folder `routes` in root dir
* Create a subfolder `api` in routes
* Now create route files like; `users.js`, `auth.js` and definde routes therein.

# Routing

* Register routes in `routes/abc.js`
```js
const express = require("express");
const router = express.Router();

// @route    GET end/point
// @desc     Test route
// @access   Public
router.get("/", (req, res) => res.send("User router"));

module.exports = router;
```

* Import these routes in `server.js`
```js
// Define Routes
app.user("/any-prefix", require("./routes/api/users.js"));
app.user("/any-prefix", require("./routes/api/admin.js"));
```

# Models
- We use models to interact with the database.
* Create a new folder `models` in root dir
