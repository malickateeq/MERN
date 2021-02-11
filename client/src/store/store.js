import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./../reducers";

// Initial state of store
const initialState = {};

// Get middlewares
const middleware = [thunk];

// Create a store
const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));


export default store;