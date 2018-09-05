import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './styles.sass';
import items from '../../assets/data/items.json';
import postings from '../../assets/data/postings.json';
import users from '../../assets/data/users.json';
import Map from '../Map/index';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

class ItemPage extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    let postingId = parseInt(this.props.match.params.id);
    this.orderNow = this.orderNow.bind(this);
    this.fetchPost = this.fetchPost.bind(this);
    this.state = {}
    if(!props.post) {
      this.fetchPost();
    }
  }

  fetchPost() {
    let status;
    let postingId = this.props.match.params.id
    fetch(`/api/post/${postingId}`).then(res => {
      status = res.status;
      return res.json();
    }).then(body => {
      console.log("body", body);
      this.setState({
        posting: body[0]
      })
    }).catch(err => {
      console.error(err);
    })
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
    window.scrollTo(0, 0);
  }

  orderNow() {
    console.log(this.state);
    let _this = this;
    
    if(!this.props.user) {
      alert("Please login to place an order.");
      
      this.props.history.push('/login');
    
    } else if(this.props.user._id == this.state.posting.userId) {
      alert("You may not place an order on your own posting")
    } else {
      console.log("Fulfilling order");
      // call web3 here
      // this.createOrder().then(function () {
      //   _this.props.history.push('trades');
      // });
    }
  }

  createOrder() {
    return fetch(this.state.server + "/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        buyerId: sessionStorage.userId,
        sellerId: this.state.posting.userId,
        itemId: this.state.posting.itemId
      })
    }).then(function(response){
      return response.json;
    });
  }

  render() {

    if(!this.state.posting) {
      return (<div>Loading...</div>);
    }

    console.log("posting", this.state.posting);

    return (
      <div>
        <div className="itemPageWrapper">
          <div className="itemImgWrapper">
            <img src={this.state.posting.images[0]}></img>
          </div>
          <div className="itemInfoWrapper">
            <Link className="backLink" to="/">
              <span className="small">
                <svg fill="#000000" height="13" viewBox="0 0 18 15" width="13" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10l5 5 5-5z"/>
                  <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
              </span>All Items
            </Link>
            <h3 className="itemName">{this.state.posting.name}</h3>
            <p className="itemCost frm">${this.state.posting.price.$numberDecimal}</p>
            <p className="description">
              {this.state.posting.description}
            </p>
            <p className="seller frm">Sold By <span>{this.state.posting.seller[0].name}</span></p>
            {/* <p className="seller frm"><span>Seller Rating: {this.state.user.rating}</span></p> */}
            <button className="reqTradeBtn normalBtn" onClick={this.orderNow.bind(this)}>Order Now</button>
          </div>
        </div>

        <Map/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(ItemPage));
