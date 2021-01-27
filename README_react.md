> Setup React

# Introduction

# Basics

# Getting Started

## Create new app
- `npx create-react-app client` 
- npx = not globally, in client folder
- cd to `client`
- `npm install axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment`
- Delete git folders and fiels inside `client`
- Add `"proxy": "http://localhost:5000"` in package.json to use axios without baseUrl
- remove `index.css`, `App.test.js` in `client/src/`

## Run both apps concurrently
2. To run both servers concurrently React and NodeJs
- Already installed package `concurrently`
- Place following scripts in package.json
```js
// To reun React Server in the `client` folder
"client": "npm start --prefix client",
// To run both servers
"dev": "concurrently \"npm run server\" \"npm run client\""
```

# JSX (Javascript Extension)


# React Router

```js
// 1. Import
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

// 2. Wrap everything within the router
<Router>
    // Entire App here

</Router>

// 3. Landing Page Load
<Router>
    <Route exact path="/" component={ Landing } />
</Router>

<section className="container">
<Switch>
    <Route exact path="/register" component={ Register } />
    <Route exact path="/login" component={ Login } />
</Switch>
</section>

// 4. Add Buttons / Links for a component
import { Link } from "react-router-dom";
<Link to="/register">Register</Link>



```