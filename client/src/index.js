import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import { createStore } from 'redux'
import App from './components/App';

import './styles/global.sass';
import './favicon.ico';
import rootReducer from './redux/reducers';

import {
    login
} from './redux/actions'

const store = createStore(rootReducer);
window.store = store;

console.log("initial state", store.getState());

const unsubscribe = store.subscribe(() => {
    console.log("final state", store.getState());
})

render (
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
    , document.getElementById('app')

);

// store.dispatch(login({
//     _id: 2,
//     username: "test"
// }));

// unsubscribe();
