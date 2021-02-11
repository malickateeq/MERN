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

## Plugins for VS Code

- ES7 React/Redux/GraphQL/React-Native snippets

## React Components

1. Render JSX component

```javascript
    // JSX
    const element = <h1>Hello, world!</h1>;     // Not a string nor HTML
    
    class App extends React.Component
    {
        render()
        {
            // Your JSX code here
            return(
                <div>
                    // JSX Code goes here..
                </div>
            )
        }
    }
```
2. Inject rendered component to any html element

```javascript
    // Render (arg1 component) and inject to (agr2 HTML element)
    // Inject 'App' component in 'app' HTML element's ID
    ReactDOM.render(<App/>, document.getElementById('app'));
```
3. Types of Components
    - Container/Class Components (have class and state)

        ```javascript
            class App extends React.Component{
                state = {
                }
                render()
                    return(
                    )
                }
            }
        ```
    - UI Component Stateless, have no class but a function (props..)
    ```javascript
        const App = (props) => {
            const { list } = props;
            return(
            )
        }
    ```

### JSX

    - HTML like syntax but;
    - Must always return one root <div> element
    - Browser don't support/understand JSX by default
    - We can't use 'class' keyword to add CSS classes BUT instead use 'ClassName'
    - Can put dynamic JS content inside {}

### State of Components (UI, Data)

```javascript
// declare inside class
state = {
    name: 'value',
}
// use in JSX like
{this.state.name}

- Whenever we change the state of a component it will re-render
```

### Component Props

```javascript
// props short for properties
// Pass data from parent component to child component

// In parent component where we use child component
<myComponent name="malik" age="22"/>

// In child component
{this.props.name}
// OR
const {name, age} = this.props;
// OR
const name = this.props.name; const age = this.props.age;
{name}

// Passing function as a prop
<Component1 myFunc={this.parentFunction}/>
// Then call ut from child like
this.props.myFunc(ifAny);

```

### React Events & Functions:

```javascript
    // In JSX
    <button onClick={ this.funcName() }></button> // funcName will invoke on page load, at start
    // VS
    <button onClick={ this.funcName }></button>   // function will only load on Click
    // Inside JS class
    funcName(e){
        console.log(e.target);
    }
    // React all events list
    [React all events list](https://reactjs.org/docs/events.html#supported-events)
```
```javascript
    // 'this' keyword isn't work in simple functions (this.state)
    simpleFunc(e){
        // this won't work here
        this.state
    }
    arrowFunc = (e) =>{
        // this works here
        this.state;
    }

    // Change data in state
    arrowFunc = (e) =>{
        // Do this good practice
        this.setState({
            var: 'New Value',
        })
        // VS bad practice
        this.state.var = 'New Value';
    }
```

### Displaying Lists in React:

```javascript
    const {players} = this.props;
    const newList = players.map(player =>{
        return (
            // each element must have a unique key
            <div key={player.id}>
                <div>Name: {player.name}</div>
                <div>Age: {player.age}</div>
            </div>
        );
    });

    // conditional output
    condition ? (for_true) : (for_false)
```

### Use images in React Components:

```javascript
    // Firt import that image in a cmponent, file must be within src folder
    import Pokeball from '../img/pokeball.png'
```

### Changing elements inside an array:

- Never modify state data directly. It is destructive and a bad practice as well.
- Instead use this.setState({}) to modify element
- *OR use below one to modify arrays

```javascript
    1. Adding
        // Fist make a copy of original array
        // this (... spread operator) will put the elemetns(objects) inside arr individually
        let newArr = [...this.state.oldArr, addNewEle_ifAny];

        // Then modify
        this.setState({
            players: newArr,
        })

    2. Removing
        deletePlayer = (id) =>{
            // get new array with filtered out this (id) element
            let newArr = this.state.players.filter(player =>{
            return ninja.id !== id ?
            });
            this.setState({
            players: newArr,
        })
}
```

### Using/Importing css and other files in React

```javascript
    import './myCSSfile.css'
    - CSS also affects all other components on the page, it is just not only for one
    - ..component in which we imported. To overcome this we scope CSS
```

## React Life Cycle:

![Image of Yaktocat](readme_images/React_lifecycle.png)

- Inside class
```javascript
    // when component first mounts
    componentDidMount(){
        // component only mounted once until we refresh the page. or delete->refresh
        console.log('component mounted.');
    }
    // this fires we get change in state
    componentDidUpdate(prevProps, prevState){
        console.log('component updated.');
    }
```

## React Router:

### Setting up react router:

```javascript
    // install React Router package
    npm install react-router-dom

    // import it where we want to use router
    import { BrowserRouter } from 'react-router-dom'

    // Wrap your entire application with 'BrowserRouter' tag
    <BrowserRouter>
        <div className="App"></div>
    </BrowserRouter>

    // Using Route also import Route { BrowserRouter, Route}
    <Route path='/' component={Home} /> // Mostly defined under

    - imp: Route also loads components of subset.
    - like both these at '/about' => '/' for Home + '/about' for About
    To avoid sub-set route components we can use
    <Route exact path='/' component={Home} /> // Will load only at '/'

    // Now we need to stop reload (send request to server) request

```

### Links & NavLinks in React Router:

```javascript
    // To stop reload (send request to server) request
    // import this where a links are used
    import { Link, NavLink } from 'react-router-dom'

    // replace a lins with; this will prevent the default action of request to server
    <Link to="/">HOME</Link>    // instead of <a href="/">HOMe</a>
```
- The difference between Link and NavLink is that the 'NavLink' add an avtive class in <a> on active

### Route Parameters:

```javascript
    <Route path="/:post_id" component={Post}></Route>

    // **Now it'll treat every /anyThing as /:post_id - issue to resolve
    /*
        1. We can do this: <Route path="/post/:post_id" component={Post}></Route>
        2. Another method is by using Switch
    */


    // where 'post_id' is route parameter; info stored also in params
    // now use 'post_id' in Post; the good time to get is in componentDidMount
    console.log(this.props);
    let id = this.props.match.params.post_id;

```

### Route Switch method to handle route parameters:

```javascript
    // 1. import package
    import {Switch} from 'react-router-dom'

    // 2. Surround all the routes with the <Switch> tab
    <Switch> Al routes here.. </Switch>

    /*  Info: It'll only match one route at a time. One route take precedence
        It'll start route matching from top to bottom..
        WithIn switch route order matters..
    */
```


### React Programmatic Redirects:

```javascript
    // React router automatically add props info in components when use in Route
    // It'll keep track of history (urls)
    // auto redirect in 2seconds
    setTimeout( ()=>{
        props.history.push('/about');
    }, 2000 );  // 2000ms == 2s
    // props data only present in Route to= URL component
    // if we want to include it manually then
    import { withRouter } from 'react-router-dom';
    // now supercharge any component
    export default withRouter(MyComponent); // now you can use props in 'MyComponent'
    // AKA 'Higher Order Components'
```

### Higher Order Components:

```javascript
    // higer order components adds props or charged cmponents with props.
    // will return component after processing in another compnent
    const Rainbow = (WrappedComponent) =>{
        return(props) => {
            return(
                <div className='text-red'>
                    <WrappedComponent {...props}/>
                </div>
            )
        }
    }
    export default Rainbow
    // now supercharge a component by
    import Rainbow from '../hoc/Rainbow'
    export default Rainbow(About);
```

## React use of Axios (For AJAX/API):

```javascript
    // Install Axios package
    npm install axios

    // the best way to get data is in componentDidMount lifecycle's hook
    // axios is async; takes somtime to complete, so always use promise to get response
    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(res => { // when request complete fire callback function
            console.log(res);
        })
    
    // now use data in template
    const {posts} = this.state; // better way to store posts in another variable rather state
```


## React Redux:

### What is Redux?

- One-liner: Centeral + Shared Data Storage 
- It'll avoid duplication of code/data
- It is a central data store for all of our application data, accessible to all components.
- Makes state management very easy and efficient.
- There's a defined process to change data in Redux. (to maintain consistency)
- Redux is a JS (global store) object.
- Install ReduxDevTools extension in Chrome

![Image of Redux](readme_images/redux.png)

### Creating Redux Store
- Create a file `src/store/store.js`
- Create a root file for all reducers `src/reducers/index.js`
> `store.js` file
```js
import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "reducers";

// Initial state of store
const initialState = {};

// Get middlewares
const middleware = [thunk];

// Create a store
const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
```

### Using this store
> In `App.js` file
```js
// Redux
// This package will connect React with Redux
import { Provider } from "react-redux";
import store from "./store/store";

// Now wrap everything within this Provider just like router
<Provider store={store}>
    // Entire app
</Provider>

```

### Create a Redux Reducer

- A reducer is a function that determines changes to an application’s state. It uses the action it receives to determine this change.
- initial state + action = new state
- Create a new reducer `reucers/alert.js`
- Import it in rootreducer `import alert from "./alert"`
- action.type is required, but action.payload is optional.
```js

// The Reducer
const contactReducer = (state = initialState, action) => 
{
  // Do something
}

// Contact The Reducer
contactReducer(initialState, action)

// New Action with type
const action = {
  type: 'NEW_CONTACT',
  name: 'John Doe',
  location: 'Lagos Nigeria',
  email: 'johndoe@example.com'
}

```

- Updating state
- The state is meant to be immutable, meaning it shouldn’t be changed directly. To create an updated state, we can make use of Object.assign or opt for the spread operator.
```js
const contactReducer = (state, action) => {
  switch (action.type) {
    case 'NEW_CONTACT':
    return Object.assign({}, state, {
      contacts: [
        ...state.contacts,
        action.payload
      ]
    })
    default:
      return state
  }
}
```



- The rootReducer
```js
import { combineReducers } from "redux";
import alert from "./alert"

export default combineReducers({
    alert
});
```

### Setting up the environment for Redux:

```javascript
    // Install following two packages:
    // 1st package To use Redux
        npm install redux

    // 2nd package To connect Redux store to React
        npm install react-redux

    // // Library for Redux
    import {createStore} from 'redux';
    import {Provider} from 'react-redux';

    // 1. create and import rootReducer and pass it
    import rootReducer from './reducers/rootReducer.js'; 

    // 2. Creating store
    const store = createStore(rootReducer);

    // 3. Wrap your app with Provider and send store also
    // Now we can access the 'store' inside the Application
    ReactDOM.render( <Provider store={store}> <App /> </Provider>, document.getElementById('root'));
```

### Using Redux in Components:

```javascript
    // Now no need to use 'state' data at least for the core data

    // 1. Connect Component to the Redux Store using "react-redux library" (a HOC)
    import {connect} from 'react-redux'

    // what data we want to grab from Redux on connecting
    // data is accessible, now, as
    this.props.posts;
    const mapStateToProps = (state) => {
        return {
            posts: state.posts
        }
    }
    export default connect(mapStateToProps)(Home); 

    // Grab conditional data
    // what data we want to grab from Redux on connecting
    const mapStateToProps = (state, ownProps) => {
        let id = ownProps.match.params.post_id;
        return {
            post: state.posts.find(post => post.id === id)  // one-line function without {}
        }
    }
```

### Changing Redux data in React Component:

```javascript
    // sending these methods to the Component's props
    // making change in Redux
        //
            handleDelete = () => {
                this.props.deletePost(this.props.post.id);
                this.props.history.push('/');
            }
        //
    const mapDispatchToProps = (dispatch) => {
        return {
            deletePost: (id) =>{ dispatch({type: 'DELETE_POST', id: id}) }
        }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(Post);
    // handle function in rootReducer.js
```

### Using a Redux Store:

```javascript
    const { createStore } = Redux; // importing package

    // data to initialize Redux with
    const initState = {
        todos: [],
        posts: []
    }

    // function to communicate with the Redux, Reducer
    // the action changes the state based on action nature
    function myReducer(state = initState, action){
    // check type of action & perform accordingly
    if(action.type == 'ADD_TODO')
        {
        // return new state
        return {
            ...state, // It'll get (spread) all other fields
            todos: [...state.todos, action.todo]  // override the todos in above spread
        }
        }
    
    if(action.type == 'ADD_POST')
        {
        // return new state
        return {
            ...state, // It'll get (spread) all other (exisitng) fields
            posts: [...state.posts, action.post]  // override the posts in above spread
        }
        }
    }

    // fire changes
    const store = createStore(myReducer);

    // listen or subscribe for state changes & use them
    // this function fires everytime when state changes
    store.subscribe( () =>{
    console.log('state updated..');
    console.log(store.getState());
    });

    // Start
    // Now use the Redux for changes via 'store' object
    // creating an action
    const todoAction = {type: 'ADD_TODO', todo: 'buy milk'}

    // Dispatch the action
    store.dispatch(todoAction); // will invoke myReducer function => action

    // Or we can also do
    store.dispatch({type: 'ADD_POST', post: 'Hello World'});
    store.dispatch({type: 'ADD_TODO', todo: 'sleep some more'});

    // End
```

### React Redux action generater:

```javascript
    // new file in a new folder actionsexport 
    // in postActions.js File
        const deletePost = (id) => {
            return{
                type: 'DELETE_POST',
                id: id
            }
        }
    // Then use it like
        const mapDispatchToProps = (dispatch) => {
            return {
                deletePost: (id) =>{ dispatch( deletePost(id) ) }
            }
        }

```
