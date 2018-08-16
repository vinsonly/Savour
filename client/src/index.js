import React from 'react';
import { render } from 'react-dom';
// import { Router, browserHistory } from 'react-router';

import {BrowserRouter as Router} from 'react-router-dom';

import App from './components/App';
import routes from './routes';

import './styles/global.sass';
import './favicon.ico';

render(

    <Router>
        <App />
    </Router>
    , document.getElementById('app')

);

