import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.sass';
import { login } from '../../redux/actions';
import { connect } from 'react-redux'
import validator from 'validator';
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

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            password_confirm: "",
            username: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.body.scrollTop = 0;
        document.querySelector('.menu').classList.remove('open');
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        swal.showLoading();
        console.log("state", this.state);

        checkRegInputs(this.state);

        let data = this.state;
        let status;
        fetch('/api/user', {
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
            if(status == 201) {
                swal({
                    text: "Welcome to Savour, click the button below to login now.",
                    type: "success"
                }).then(res => {
                    console.log("res.value", res.value);
                    if(res.value) {
                        this.props.onLogin(body);
                    }
                })
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

    render() {
        if(this.props.user) {
            this.props.history.push('/');
        }

        return ( 
            <div className = "loginWrapper" >
                <h3 className = "loginHeading text-center"> Register For a New Account </h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="inputWrapper">
                        <label className="required">Full Name*:</label>
                        <input name="name" type="text" placeholder="Enter Full Name" onChange={this.handleChange} value={this.state.name} required />
                    </div>
                    <div className="inputWrapper">
                        <label className="required">Username*:</label>
                        <input name="username" type="text" placeholder="Enter Username" onChange={this.handleChange} value={this.state.username} required />
                    </div>
                    <div className="inputWrapper">
                        <label className="required">Email*:</label>
                        <input name="email" type="text" placeholder="Enter Email" onChange={this.handleChange} value={this.state.email} required />
                    </div>
                    <div className="inputWrapper">
                        <label className="required">Password*:</label>
                        <input name="password" type="password" placeholder="Enter Password" onChange={this.handleChange} value={this.state.password} required />
                    </div>
                    <div className="inputWrapper">
                        <label className="required">Verify Password*:</label>
                        <input name="password_confirm" type="password" placeholder="Verify Your Password" onChange={this.handleChange} value={this.state.password_confirm} required />
                    </div>
                    <div className="buttonWrapper text-center">
                        <button className="confirm-button" type="submit">Register</button>
                    </div>
                </form>
            </div>
        );
    }
  }

  function checkRegInputs(state) {
    if(!validator.equals(state.password, state.password_confirm)) {
        swal("passwords do not match");
        return false
    }

    if(!validator.isEmail(state.email)) {
        swal('Email is invalid');
        return false
    }

    return true;
  }

  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));