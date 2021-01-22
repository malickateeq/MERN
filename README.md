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

