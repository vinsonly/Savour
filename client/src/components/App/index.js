import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from '../Header/index';
import Footer from '../Footer/index';
import './styles.sass';
import '../../styles/animation.sass';

import Main from '../Main/index';
import Profile from '../Profile/index';
import Login from '../Login/index';
import SignUp from '../SignUp'
import Trades from '../Trades/index';
import ItemPage from '../ItemPage/index';
import MyItems from '../MyItems/index';
import ErrorPage from '../ErrorPage/index';

class App extends Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className="wrapper">
      <div className="text-right">{sessionStorage.getItem("userName")}</div>
        <Header/>
        <ReactCSSTransitionGroup
          transitionName="content"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {/* <div key={this.props.location.pathname}>
            {this.props.children}
          </div> */}
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
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  "location.pathname": PropTypes.string
};

export default App;
