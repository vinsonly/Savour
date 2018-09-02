import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Main from './Main';
import Profile from './Profile';
import Login from './Login';
import SignUp from './SignUp'
import Trades from './Trades';
import ItemPage from './ItemPage';
import MyItems from './MyItems';
import ErrorPage from './ErrorPage';

export default class Routes extends Component {
    render(){
        return(
            <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/item/:id" component={ItemPage} />
                <Route path="/profile" component={Profile} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={SignUp} />
                <Route path="/trades" component={Trades} />
                <Route path="/myItems" component={MyItems} />
                <Route path="*" component={ErrorPage} />
            </Switch>
        )
    }
}