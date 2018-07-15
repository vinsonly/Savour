import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import OpenOrder from '../OpenOrder/index';
import ReceivedOrder from '../ReceivedOrder/index';
import OpenPosting from '../OpenPosting/index';
import AddItemPage from '../AddItemPage/index';
import userData from "./../../assets/data/users.json";
import postingData from "./../../assets/data/postings.json";
import './styles.sass';

class Trades extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      modalOpened: false,
      orders:[],
      server: JSON_SERVER
    };
  }

  componentDidMount() {
    var userSession = sessionStorage.getItem("userId");
    if (!userSession) {
      console.log("no user session");
      browserHistory.push('login');
    }
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
    this.getJsonData("orders");
  }

  closeModal() {
    this.setState({ modalOpened: false });
    document.body.classList.remove('modal-opened');
    document.body.style.marginRight = 0;
  }

  getAllReceivedOrder() {
    var self = this;
    const list = this.state.orders.map(function (order, i){
      if(order.sellerId == sessionStorage.getItem("userId")) {
        return (<ReceivedOrder orderId={order.id} buyerId={order.buyerId} itemId={order.itemId} />);
      }
    });
    console.log("list" + list);
    return (
      <div className="tradeProposedWrapper">
      <h3 className="unCap">Received Orders</h3>
      <div className="allProposedTradesWrapper">
        {list}
      </div>
      </div>);
  }

  getJsonData(type) {
    return fetch(this.state.server + type).then(response => response.json())
      .then(data => this.setState({orders: data}));
  }

  getAllOpenOrder() {
    var self = this;
    const list = this.state.orders.map(function (order, i){
      if(order.buyerId == sessionStorage.getItem("userId")) {
        return (<OpenOrder orderId={order.id} sellerId={order.sellerId} itemId={order.itemId}/>);
      }
    });
    return (<div className="tradeReqWrapper">
    <h3 className="unCap">Open Orders</h3>
    <div className="allTradeRequestsWrapper">
      {list}
    </div>
  </div>);

  }

  getModal() {
    if (this.state.modalOpened) {
      return <AddItemPage key="modal" openClass="open" close={this.closeModal.bind(this)} />;
    } else {
      return;
    }
  }

  openModal() {
    const scrollBar = document.querySelector('.scrollbar-measure');
    const scrollBarWidth = scrollBar.offsetWidth - scrollBar.clientWidth;
    document.body.classList.add('modal-opened');
    document.body.style.marginRight = `${scrollBarWidth}px`;
    this.setState({ modalOpened: true });
  }

  getUserInfo(type) {
    const userId = sessionStorage.getItem("userId");
    if(userId) {
      console.log(userData.users);
      for (var i in userData.users) {
        if (userData.users[i].id == userId) {
          console.log(userData.users[i][type]);
          return userData.users[i][type];
        }
      }
    }
    return null;
  }

  getOrders() {
    const type = this.getUserInfo("type");
    console.log("user type :" + type);
    if (type == "seller") {
      return ([this.loadOpenPosting(), this.getAllReceivedOrder()]);
    } else {
      return (this.getAllOpenOrder());
    }
  }

  loadOpenPosting() {
    var self = this;
    const list = postingData.postings.map(function (posting, i){
      if(posting.userId == sessionStorage.getItem("userId")) {
        return <OpenPosting postingId={posting.id} />;
      }
    });
    console.log("list" + list);
    return (
      <div className="tradeReqWrapper">
        <h3 className="unCap">Open Postings</h3>
        <div className="allTradeRequestsWrapper">
          {list}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="tradesWrapper">
        {this.getModal()}
        <div className="addTradeWrapper">
          <Link to="myItems"><button className="tradeBtn allItemsBtn"></button></Link>
          <button
            onClick={() => {
              this.openModal();
            }}
            className="tradeBtn addItemBtn">
            + Add Item
          </button>
        </div>
        <div className="tradesInfoWrapper">
          {this.getOrders()}
        </div>
      </div>
    );
  }
}

export default Trades;
