import React, { Component } from 'react';
import { Link } from 'react-router';
import './styles.sass';

import items from '../../assets/data/items.json';

import postings from '../../assets/data/postings.json';

import users from '../../assets/data/users.json';

import { browserHistory } from 'react-router';

import Map from '../Map/index';



class ItemPage extends Component {
  constructor(props) {
    super(props)
    
    console.log(this.props)

    let postingId = parseInt(this.props.routeParams.id);

    console.log(postingId);

    let thisPosting = postings.postings.find(function(posting) {
      return parseInt(posting.id) == parseInt(postingId);
    })

    let thisItem = items.items.find(function(item) {
      return parseInt(item.id) == parseInt(thisPosting.itemId);
    })

    let thisUser = users.users.find(function(user){
      return parseInt(user.id) == parseInt(thisPosting.userId);
    })

    this.state = {
      posting: thisPosting, 
      item: thisItem,
      user: thisUser
    }
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
  }

  orderNow() {
    console.log(this.state);
    
    if(sessionStorage.userId == null || parseInt(sessionStorage.userId) < 1) {
      alert("Please login to place an order.");
      
      browserHistory.push('login');
      
    } else {
      console.log("Fulfilling order");
      // call web3 here
    }

  }

  render() {
    window.state = this.state;

    let picUrl = "/" + this.state.item.picture;

    return (
      <div>
        <div className="itemPageWrapper">
          <div className="itemImgWrapper">
            <img src={picUrl}></img>
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
            <h3 className="itemName">{this.state.item.name}</h3>
            <p className="itemCost frm">${this.state.item.price}</p>
            <p className="description">
              {this.state.item.desc}
            </p>
            <p className="seller frm">By <span>{this.state.user.name}</span></p>
            <p className="seller frm"><span>Seller Rating: {this.state.user.rating}</span></p>
            <button className="reqTradeBtn normalBtn" onClick={this.orderNow.bind(this)}>Order Now</button>
          </div>
        </div>

        <Map/>
      </div>
    );
  }
}

export default ItemPage;
