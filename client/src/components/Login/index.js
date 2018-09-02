import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.sass';
import users from './../../assets/data/users.json';
import { login } from '../../redux/actions';
import { connect } from 'react-redux';
import swal from 'sweetalert2';


const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (user) => {
      dispatch(login(user))
    } 
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user : '',
      password : ''
    };
    this.updateValue = this.updateValue.bind(this);
    this.login = this.login.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
  }

  updateValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  login() {
    console.log("state", this.state);
    let _this = this;

    let data = this.state;
    let status;
    fetch('/api/login', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        }
    }).then((res) => {
        status = res.status;
        return res.json()
    })
    .then(body => {
        console.log("body", body);
        console.log("status", status);
        if(status == 200) {
            // save token to local storage
            localStorage.setItem('session_token', body.token);

            // set user into state
            let user = body
            delete user.token
            _this.props.onLogin(user);

            _this.props.history.push('/');
        } else {
          swal({
              text: body.message,
              type: "error"
          })
        }
    })
    .catch(err => {
        console.log("err", err);
    })
  }

  signOut() {
    sessionStorage.clear();
    localStorage.removeItem('session_token');
    this.props.history.push('/')
  }
 
 
  render() {

    let header = (this.props.user) ? ("Login") : ("Sign Out")

    return (
      <div className="loginWrapper">
        <h3 className="loginHeading text-center">Login</h3>
        <div className="btnWrapper">
          <div className="inputWrapper">
            <label htmlFor="itemName">Name:</label>
            <input name="user" type="text" placeholder="Enter Username or Email" onChange={this.updateValue} required />
          </div>
          <div className="inputWrapper">
            <label htmlFor="itemName">Password:</label>
            <input name="password" type="password" placeholder="Enter Password" onChange={this.updateValue} required />
          </div>
          <div className="buttonWrapper text-center">
            <button className="saveItemBtn" onClick={this.login}>Login</button>
          </div>
          <a href="/register"><button>Register For a New Account Now</button></a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));