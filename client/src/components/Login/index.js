import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.sass';
import users from './../../assets/data/users.json';
import { login } from '../../redux/actions';
import { connect } from 'react-redux'


const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: () => {
      dispatch(login({
        _id: 2,
        username: "test"
      }))
    } 
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : '',
      passwd : ''
    };
    this.updateValue = this.updateValue.bind(this);
    this.renderLoginOrLogOut = this.renderLoginOrLogOut.bind(this);
    this.login = this.login.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
  }

  updateValue(evnt) {
    this.setState({[evnt.target.name]: evnt.target.value});
  }

  login() {
    var userFromDB = users['users'];
    var currentUsername = this.state.username;
    let _this = this;
    userFromDB.map(function(user){
      if(user.username === currentUsername) {
        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userName", user.name);
        _this.props.history.push('trades');
      }
    })
    this.props.onLogin();
    // if not found, do nothing for now
  }r

  renderLoginOrLogOut() {
    if (parseInt(sessionStorage.getItem("userId"))) {
      return (
        <div className="btnWrapper">
          <div className="buttonWrapper text-center">
          <button className="saveItemBtn" onClick={this.signOut}>Sign Out</button>
          </div>
        </div>);
    } else {
     return (
     <div className="btnWrapper">
        <div className="inputWrapper">
          <label htmlFor="itemName">Name:</label>
          <input id="userName" name="username" type="text" className="userName" placeholder="Enter UserName" onChange={this.updateValue} required />
        </div>
        <div className="inputWrapper">
          <label htmlFor="itemName">Password:</label>
          <input id="passwd" name="passwd" type="password" className="passwd" placeholder="Enter Password" onChange={this.updateValue} required />
        </div>
        <div className="buttonWrapper text-center">
          <button className="saveItemBtn" onClick={this.login}>Login</button>
        </div>
        {(!this.props.user) ? (
          <a href="/register"><button>Register For a New Account Now</button></a>
        ) : (<div />)}
      </div>
     );
    }
  }


  signOut() {
    sessionStorage.clear();
    this.props.history.push('/')
  }
 
 
  render() {

    let header = (this.props.user) ? ("Login") : ("Sign Out")

    return (
      <div className="loginWrapper">
        <h3 className="loginHeading text-center">Login</h3>
        {this.renderLoginOrLogOut()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));