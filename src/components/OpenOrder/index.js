import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import { browserHistory } from 'react-router';
import userData from '../../assets/data/users.json';
import './styles.sass';

class OpenOrder extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      modalOpened: false,
      orderId: this.props.orderId,
      server: JSON_SERVER
    };
    this.fulfillOrder = this.fulfillOrder.bind(this);
  }

  getItemInfo(itemId,type) {
    for (var i in itemsData.items) {
      if (itemsData.items[i].id == itemId) {
        return itemsData.items[i][type];
      }
    }
  }

  getUserInfo(userId, type) {
    for( var i in userData.users) {
      if (userData.users[i].id == userId) {
        return userData.users[i][type];
      }
    }
  }

  getSellerName() {
    var sellerId = this.props.sellerId;
    return this.getUserInfo(sellerId, "name");
  }

  getItemName() {
    var itemId = this.props.itemId;
    return this.getItemInfo(itemId, "name");
  }

  fulfillOrder() {
    return fetch(this.state.server + "orders/" +  this.props.orderId,{
      method: "DELETE"
    }).then(function(response){
      return window.location.reload();
    });
  }

  render() {
    return (
      <div className="trWrapper">
        <div className="upper">
          <h4>
          <p>You have ordered <Link>{this.getItemName()}</Link> from {this.getSellerName()}.</p>
          </h4>
        </div>
        <div className="tradeBtnWrapper lower">
          <button className="cancelBtn normalBtn" onClick={this.fulfillOrder}>Receive Order</button>
        </div>
      </div>
    );
  }
}

export default OpenOrder;
