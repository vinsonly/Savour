import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../../redux/actions';
import { connect } from 'react-redux';

import './styles.sass';

const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => {
      dispatch(signOut())
    }
  }
}

class Header extends Component {

  constructor(props) {
    super(props);
    
    if(props.user) {
      this.state = {
        loggedIn: true
      }
    } else {
      this.state = {
        loggedIn: false
      }
    }

    this.setNav = this.setNav.bind(this);
    this.setMenuState = this.setMenuState.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  loggedInMenu = (
    <div className="menu">
      {/* <Link onlyActiveOnIndex={true} key={5} to="" activeClassName="activeNavLink" className="navLink">
        {sessionStorage.getItem("userName")}
      </Link> */}
      <Link onlyActiveOnIndex={true} key={1} to="/" activeClassName="activeNavLink" className="navLink">
        Home
      </Link>
      {/* <Link onlyActiveOnIndex={true} key={2} to="/profile" activeClassName="activeNavLink" className="navLink">
        Profile
      </Link> */}
      <Link onlyActiveOnIndex={true} key={3} to="/trades" activeClassName="activeNavLink" className="navLink">
        Orders
      </Link>
      <Link onlyActiveOnIndex={true} key={5} to="#" onClick={this.signOut} activeClassName="activeNavLink" className="navLink">
        Sign Out
      </Link>
    </div>
  );
  
  loggedOutMenu = (
    <div className="menu loginMenu">
    <Link onlyActiveOnIndex={true} key={1} to="/" activeClassName="activeNavLink" className="navLink">
        Home
      </Link>
      <Link onlyActiveOnIndex={true} key={2} to="/login" activeClassName="activeNavLink" className="navLink">
        Log In
      </Link>
      <Link onlyActiveOnIndex={true} key={3} to="/register" activeClassName="activeNavLink" className="navLink">
        Register
      </Link>
    </div>
  );

  signOut() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('state');
    this.props.signOut();
  }

  componentWillMount() {
    this.previousWidth = 0;
    this.menuButton = (
      <button className="menuBtn"
        onClick={
          () => {
            document.querySelector(".menu").classList.toggle("open");
          }
        }
      >
        MENU
      </button>
    );

    this.setNav();
    this.setMenuState(window.innerWidth);
    this.previousWidth = window.innerWidth;
  }

  componentDidUpdate() {
    this.setNav();
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setMenuState(window.innerWidth);
    });
  }

  setMenuState(width) {
    if (this.previousWidth !== width) {
      if (width > 768) {
        const menu = document.querySelector('div.menu');
        if(menu) {
          menu.classList.remove("open");
        }
        this.setState({menuActive: false});
      } else {
        this.setState({menuActive: true});
      }
      this.previousWidth = width;
    }
  }

  setNav() {
    let loggedIn;
    if (this.props.user && this.props.user.username) {
      loggedIn = true
    } else {
      loggedIn = false
    }

    if(loggedIn !== this.state.loggedIn) {
      this.setState({ loggedIn: loggedIn });
    }
  }

  render() {
    let menu;
    if(this.state.loggedIn) {
      menu = this.loggedInMenu;
    } else {
      menu = this.loggedOutMenu;
    }

    return (
      <header className="header">
        <h1>
          <Link to="/" className="logo">
            Savour
          </Link>
        </h1>
        {this.state.menuActive ? this.menuButton: ""}
        {menu}
      </header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
