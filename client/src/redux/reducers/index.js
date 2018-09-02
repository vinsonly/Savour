import {
    LOGIN,
    SIGN_OUT
} from '../actions';

import { combineReducers } from 'redux'


function user(state = {}, action) {
    switch(action.type) {
        case LOGIN:
            console.log("action.user", action.user);
            console.log("state", state);
            let value = Object.assign({}, state, 
                action.user
            )
            console.log("value", value);
            return value;
        case SIGN_OUT:
            return Object.assign({}, state, {
                user: null    
            })
        default:   
            return state
    }
}

const rootReducer = (state = {}, action) => {
    return {
        user: user(state.user, action)
    }
}

export default rootReducer;