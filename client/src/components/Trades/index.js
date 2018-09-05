import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import OpenOrder from '../OpenOrder/index';
import ReceivedOrder from '../ReceivedOrder/index';
import OpenPosting from '../OpenPosting/index';
import AddItemPage from '../AddItemPage/index';
import userData from "./../../assets/data/users.json";
import postingData from "./../../assets/data/postings.json";
import './styles.sass';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}


class Trades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false,
    };
    this.fetchData.bind(this)();
    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchBuyOrders = this.fetchBuyOrders.bind(this);
    this.getOpenPosting = this.getOpenPosting.bind(this);
    this.getOpenOrders = this.getOpenOrders.bind(this);
    this.getReceivedOrders = this.getReceivedOrders.bind(this);
  }

  fetchData() {
    this.fetchPosts();
    this.fetchBuyOrders();
  }

  fetchPosts() {
    // get seller posts
    let status;
    let _this = this;
    fetch(`/api/posts/seller/${this.props.user._id}`).then(res => {
      status = res.status;
      return res.json();
    }).then(body => {
      console.log("status", status);
      console.log("body", body);
      _this.setState({
        postings: body
      })
    }).catch(err => {
      console.error(err);
    })
  }

  fetchBuyOrders() {
    let status;
    let _this = this;
    fetch(`/api/orders/buyer/${this.props.user._id}`).then(res => {
      status = res.status;
      return res.json();
    }).then(body => {
      console.log("status", status);
      console.log("body", body);
      _this.setState({
        orders: body
      })
    }).catch(err => {
      console.error(err);
    })
  }

  componentDidMount() {
    if (!this.props.user.name) {
      console.log("no user session");
      this.props.history.push('login');
    }
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');

  }

  openModal() {
    const scrollBar = document.querySelector('.scrollbar-measure');
    document.body.classList.add('modal-opened');
    this.setState({ modalOpened: true });
  }

  closeModal() {
    this.setState({ modalOpened: false });
    document.body.classList.remove('modal-opened');
    document.body.style.marginRight = 0;
  }

  getModal() {
    if (this.state.modalOpened) {
      return <AddItemPage key="modal" openClass="open" close={this.closeModal.bind(this)} />;
    } else {
      return;
    }
  }

  getOrders() {
    let user = this.props.user;
    console.log("user", user);
    if(!user) {
      console.log("unable to get postings, user is not logged in");
      return;
    }
    return ([this.getOpenPosting(), this.getReceivedOrders(), this.getOpenOrders()]);
  }

  getOpenPosting() {
    let _this = this;
    const list = this.state.postings.map(function (posting, i){
      if(posting.userId == _this.props.user._id) {
        return <OpenPosting posting={posting} updatePosts={_this.fetchPosts} key={i} />;
      }
    });
    console.log("list" + list);
    return (
      <div className="tradeReqWrapper">
        <h3 className="unCap">Your Open Postings</h3>
        <div className="allTradeRequestsWrapper">
          {list}
        </div>
      </div>
    );
  }

  getOpenOrders() {
    let _this = this;
    const list = this.state.orders.map(function (order, i){
      if(order.buyerId == _this.props.user._id) {
        return (<OpenOrder orderId={order._id} sellerId={order.sellerId} postingId={order.postingId} key={i}/>);
      }
    });
    return (
      <div className="tradeReqWrapper">
        <h3 className="unCap">Open Orders</h3>
        <div className="allTradeRequestsWrapper">
          {list}
        </div>
      </div>
    );
  }

  getReceivedOrders() {
    let _this = this;
    const list = this.state.orders.map(function (order, i){
      if(order.sellerId == _this.props.user._id) {
        return (<ReceivedOrder orderId={order.id} buyerId={order.buyerId} itemId={order.postingId} />);
      }
    });
    console.log("list" + list);
    return (
      <div className="tradeProposedWrapper">
        <h3 className="unCap">Your Received Orders</h3>
        <div className="allProposedTradesWrapper">
          {list}
        </div>
      </div>
    );
  }


  render() {

    if(!this.state.orders || !this.state.postings) {
      return <div>Loading...</div>
    }

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

export default connect(mapStateToProps)(withRouter(Trades));
