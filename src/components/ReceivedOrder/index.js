import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import ordersData from '../../assets/data/orders.json';
import userData from '../../assets/data/users.json';
import './styles.sass';

class ReceivedOrder extends Component {

  getOrder(orderId, type) {
    var orders = ordersData['orders'];
    for (var i in orders) {
      if (orders[i].id == orderId) {
        return orders[i][type];
      }
    }
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
    var buyerId = this.getOrder(this.props.orderId, "buyerId");
    return this.getUserInfo(buyerId, "name");
  }

  getItemName() {
    var itemId = this.getOrder(this.props.orderId, "itemId");
    return this.getItemInfo(itemId, "name");
  }

  render() {
    return (
      <div className="ptWrapper">
        <div className="upper">
          <h4>
          <p>{this.getBuyerName()} have ordered <Link>{this.getItemName()}</Link> from you.</p>
          </h4>
        </div>
        <div className="tradeBtnWrapper lower">
          <button className="acceptBtn normalBtn">Accept</button>
          <p>   </p>
          <button className="declineBtn normalBtn">Decline</button>
        </div>
      </div>
    );
  }
}

export default ReceivedOrder;
