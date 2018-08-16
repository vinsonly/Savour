import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import BasicInfo from '../BasicInfo/index';
import OtherInfo from '../OtherInfo/index';
import './styles.sass';

class Profile extends Component {
  componentDidMount() {
    var userSession = sessionStorage.getItem("userId");
    if (!userSession) {
      console.log("no user session");
      this.props.history.push('/login');
    }
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
  }
  render() {
    return (
      <div className="infoWrapper">
        <BasicInfo />
        <OtherInfo />
      </div>
    );
  }
}

export default withRouter(Profile);
