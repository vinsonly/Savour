import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import ordersData from '../../assets/data/orders.json';
import userData from '../../assets/data/users.json';
import './styles.sass';

class OpenOrder extends Component {
  getOrder(orderId, type) {
    console.log("orderid"  +orderId);

    for (var ind in ordersData['orders']) {
      if (orderId == ordersData['orders'][ind].id) {
        return ordersData['orders'][ind][type];
      }
    }
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
    var sellerId = this.getOrder(this.props.orderId, "sellerId");
    return this.getUserInfo(sellerId, "name");
  }

  getItemName() {
    var itemId = this.getOrder(this.props.orderId, "itemId");
    return this.getItemInfo(itemId, "name");
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
          <button className="cancelBtn normalBtn">Cancel Order</button>
        </div>
      </div>
    );
  }
}

export default OpenOrder;
