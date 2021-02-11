import { SET_ALERT, REMOVE_ALERT } from "../actions/constants";

const initialState = [
    // Will have following Sample data
    // {
    //     id: 1,
    //     msg: "Please log in.",
    //     type: "success"
    // },
];

const func = function(state = initialState, action) {
    const { type, payload } = action;
    switch (type) 
    {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}

export default func