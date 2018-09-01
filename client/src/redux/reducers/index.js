import {
    LOGIN,
    SIGN_OUT
} from '../actions';

import { combineReducers } from 'redux'


function user(state = {}, action) {
    switch(action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                user: action.user
            })
    }
}

const rootReducer = (state = {}, action) => {
    return {
        user: user(state.user, action)
    }
}

export default rootReducer;