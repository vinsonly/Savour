import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import routes from './routes';

import './styles/global.sass';
import './favicon.ico';

import getWeb3 from './utils/getWeb3'

getWeb3.then(res => {
    console.log(res);
    
    // store web3 to be accessible everywhere
    window.web3 = res;
    sessionStorage.setItem("web3", res);
}).catch(err => {
    console.log(err);
})

render(<Router history={browserHistory} routes={routes} />, document.getElementById('app'));

