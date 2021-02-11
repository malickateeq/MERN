import { SET_ALERT, REMOVE_ALERT } from "./constants";

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = Math.floor(Math.random() * 99999999);
    dispatch({ 
        type: SET_ALERT,
        payload: { msg, alertType, id }  
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id, }), timeout);
}