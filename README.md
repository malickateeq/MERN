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
            useCreateIndex: true
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

# Http Requests

1. Create an endpoint
```js
// Register a routes
router.post("/", (req, res) => {
    console.log(req);
});
```

2. To access data / body of a request we need to enable middleware in express
- Goto `server.js` and add this line
```js
// To get data of Request's body
app.use(express.json({ extended: false }));
```

3. Access URL Parameters
```js
req.params.param1;
```

## Express Validator
- Use to validate user's input data
- Express Validator is basically a middleware.
- For details: Express-Validator [Express Validator]("https://express-validator.github.io/docs/")
```js
// Include package files
const { check, validationResult } = require("express-validator/check");

// Validate Request
router.post("/", [
    // Validation rules here..
    // check("filedName", "Error message").ruleA().ruleB();
    check("name", "Name is required.").not().isEmpty(),
    
    check("email", "Please enter a valid email address.").isEmail(),
    
    check("password", "Please enter a password with 6 or more characters.").isLength({ min: 6 })
],
async (req, res) => {

    // Perform Validation
    const errors = validationResult(req);

    // If there're errors then
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req);
    res.send("User registered successfully!");
});
```

## String a record in database
```js
// 1. Include the User model
const User = require("../../models/User");

// 2. Fetch request contents after validations
const { name, email, password } = req.body;

// 3. Storing a record in database
try {
    // 1. See if user already exists
    let user = await User.findOne({ email: email });

    if(user) {
        // Return the same error in format as default one
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // 2. Get Users Gravator
    const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
    });

    user = new User({
        name,
        email,
        password,
        avatar
    });

    // 3. Encrypt password
    // Use salt the more the secure
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // 4. Return jsonwebtoken
    res.send("User registered successfully!");

} catch (err) {
    // Server error
    console.error(err.message);
    res.status(500).send("Server error");
}

```

# Json Web Token (JWT)
- It is use to authenticate users
- 3 parts: Header.Payload.Signature

1. Add this secret key in `config` 
```js
"jwtSecret": "AllIsWellToken"
```

2. Creating the token
```js
// 1. Include jwt library
const jwt = require("jsonwebtoken");

// 2. Create Payload
const payload = {  },

// 3. Sign JWT
jwt.sign(
    payload, 
    config.get("jwtSecret"),
    { expiresIn: 36000 },
    (err, token) => {
        if(err) throw err;
        return res.json({
            token
        });
});
```

# Authentication
- Firstly get the JWT to authenticate users
1. Create a folder `middleware` and a file `auth.js` therein.
2. Implement JWT authentiaction.

## Create a middleware
```js
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next)
{
    // 1. Get the token from the header
    const token = req.header("x-auth-token");

    // Check if no token
    if(!token){
        return res.status(401).json({ msg: "No token found." });
    }

    // 2. Verify the token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid." });
    }
}
```

## Use middleware for a route

```js

// 1. Include middleware file in routes
const auth = require("./../../middleware/auth");

// 2. Apply this middleware to a route

// @route    GET api/auth
// @desc     Test route
// @access   Only JWT verified requests
router.get("/", auth, async (req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }

});

// 3. Get Authentication token via Credentials
// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server error");
    }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post("/", [
    check("email", "Please enter a valid email address.").isEmail(),
    check("password", "Password is required.").exists()
],
async (req, res) => {
    // Perform Validation
    const errors = validationResult(req);

    // If there're errors then
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });

        if(!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
        }
    
        const payload = {
            user: {
                id: user.id
            }
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
        }

        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
                if(err) throw err;
                return res.json({
                    token
                });
        });
    } catch (err) {
        // Server error
        console.error(err.message);
        return res.status(500).send("Server error");
    }
});

```

# Mongo DB with mongoose

- Always use `await` before calling a mongoose method. Coz Mangoose always returns a promise. 

## Creating Models
- We use models to interact with the database.

1. Create a new folder `models` in root dir
2. Now create a file / Model therein. i.e. `User.js`
3. Then;
```js
// Import `mongoose` package
const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Export this schema
module.exports = User = mongoose.model('user', userSchema);
```

## Using Models

### Store a record
```js
// Include the model file
const User = require("../../models/User");

user = new User({
    name,
    email,
    password,
    avatar
});

// Manipulate fields
user.password = passwor + "salt";
await user.save();
```

### Fetch a record
```js
// Find by Id function
const user = await User.findById(req.user.id).select("-password");

// Specify attribute in object attr: value
const user = await User.findOne({ user: req.user.id }).select("-password");
```

### Select Fields
```js
// To fetch a field name
.select("fieldName");

// To exclude a field with - sign
.select("-password")
```

### Select from related collections
```js
// .populate("relatedCollectionName", ["attr1", "attr2"]
.populate("user", ["name", "avatar"]);
```

### Find and Update
```js
// Update the profile                      Find by user          Fields
profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

// If put invalid (length) objectId it will throw an error
// In catch
if(error.kind == "ObjectId")
{
    return res.status(400).json({ msg: "Profile not found." });
}
```

### Find and Update a few fields
```js
const profile = await Profile.findOne({ user: req.user.id });
// push insert in the end
// unshift insert in the beginning
profile.experience.unshift(newExp);
await profile.save();
```

### Remove an object from a record
- Mongo DB has object Id within a recordId
- It is easy to nest related data in a single document
- Not need for too many relationships
- LIKE: user { _id, email, education: { _id, name } }

```js
const profile = await Profile.findOne({ user: req.user.id });
// Get the correnct experience to remove
const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

profile.experience.splice(removeIndex, 1);
await profile.save();
```
