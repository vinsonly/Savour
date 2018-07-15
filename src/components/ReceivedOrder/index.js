import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import userData from '../../assets/data/users.json';
import './styles.sass';

class ReceivedOrder extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      orderId: this.props.orderId,
      server: JSON_SERVER
    };
    this.cancelOrder = this.cancelOrder.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
  }

  getItemInfo(itemId,type) {
    var items = itemsData['items'];
    for (var i in items) {
      if (items[i].id == itemId) {
        return items[i][type];
      }
    }
  }

  getUserInfo(userId, type) {
    var users = userData['users'];
    for (var i in users) {
      if (users[i].id == userId) {
        return users[i][type];
      }
    }
  }

  getBuyerName() {
    var buyerId = this.props.buyerId;
    console.log("buyerid" + buyerId);
    return this.getUserInfo(buyerId, "name");
  }

  getItemName() {
    var itemId = this.props.itemId;
    return this.getItemInfo(itemId, "name");
  }

  acceptOrder() {
    return fetch(this.state.server + "orders/" + this.props.orderId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        buyerId: this.props.buyerId,
        sellerId: sessionStorage.userId,
        itemId: this.props.itemId,
        accepted: true
      })
    }).then(function(response){
      return window.location.reload();
    });
  }
  cancelOrder() {
    return fetch(this.state.server + "orders/" +  this.props.orderId,{
      method: "DELETE"
    }).then(function(response){
      return window.location.reload();
    });
  }
  renderButton() {
    if (!this.props.accepted) {
      return (<div className="tradeBtnWrapper lower">
      <button className="declineBtn normalBtn"onClick={this.acceptOrder} hidden={this.props.accepted}>Accept</button>
        <button className="declineBtn normalBtn" onClick={this.cancelOrder} hidden={this.props.accepted}>Decline</button>
      </div>);
    }
  }

  render() {
    return (
      <div className="ptWrapper">
        <div className="upper">
          <h4>
          <p>{this.getBuyerName()} have ordered <Link>{this.getItemName()}</Link> from you.</p>
          </h4>
        </div>
        {this.renderButton()}
      </div>
    );
  }
}

export default ReceivedOrder;
