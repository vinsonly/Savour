import React, { Component } from 'react';
import { Link } from 'react-router';
import './styles.sass';

import items from '../../assets/data/items.json';

import postings from '../../assets/data/postings.json';

import users from '../../assets/data/users.json';

import { browserHistory } from 'react-router';

import Map from '../Map/index';

import getWeb3 from '../../utils/getWeb3';

import Escrow from '../../../build/contracts/Escrow.json'



class ItemPage extends Component {
  constructor(props) {
    super(props)

      fetch('https://api.coinmarketcap.com/v2/ticker/1027/')
      .then(res => {
        return res.json();
      })
      .then(body => {
        console.log(body.data.quotes.USD.price);
        this.setState({
          ethusd: body.data.quotes.USD.price
        })
        window.state = this.state;
      }) 
      .catch(err => {
        console.log(err);
      });
    
    let postingId = parseInt(this.props.routeParams.id);

    let thisPosting = postings.postings.find(function(posting) {
      return parseInt(posting.id) == parseInt(postingId);
    })

    let thisItem = items.items.find(function(item) {
      return parseInt(item.id) == parseInt(thisPosting.itemId);
    })

    let thisUser = users.users.find(function(user){
      return parseInt(user.id) == parseInt(thisPosting.userId);
    })

    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com';

    this.state = {
      posting: thisPosting, 
      item: thisItem,
      user: thisUser,
      server: JSON_SERVER
    }
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
  }

  orderNow() {

    console.log(sessionStorage.getItem("web3"));
    
    if(sessionStorage.userId == null || parseInt(sessionStorage.userId) < 1) {
      alert("Please login to place an order.");
      
      browserHistory.push('login');
    
    } else if(parseInt(sessionStorage.userId) == this.state.posting.userId) {
      alert("You may not place an order on your own posting")
      
    } else {
      console.log("Fulfilling order");
      // call web3 here

      getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        let ethPrice;

        if(this.state.ethusd) {
          ethPrice = parseInt(this.state.posting.price)/this.state.ethusd;
        } else {
          ethPrice = parseInt(this.state.posting.price)/450;
        }
  
        // Instantiate contract once web3 provided.
        this.instantiateContract(ethPrice)
      })
      .catch(() => {
        console.log('Error finding web3.');
        browserHistory.push('trades');

      })

      // this.createOrder().then(function () {
      //   browserHistory.push('trades');
      // });
    }
  }

  instantiateContract(ethPrice) {
    const contract = require('truffle-contract')
    const escrow = contract(Escrow)
    escrow.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var escrowInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      escrow.new({from: "0xA86DC04a1b9d5bc43550783bC0CA9CEf110b6A23"})
        .then(instance => {
          console.log(instance);
          escrowInstance = instance;
          let wei = this.state.web3.toWei(ethPrice, "ether");
          console.log(wei);
          return instance.deposit("0x442399335d14B7D1A56961fb3fBAd2C41a672a24", {
            from: "0xA86DC04a1b9d5bc43550783bC0CA9CEf110b6A23",
            value: wei
          });
        })
        .then(result => {
          console.log(result);
          return escrowInstance.depositsOf.call("0x442399335d14B7D1A56961fb3fBAd2C41a672a24")
        })
        .then(res => {
          console.log("deposits:"  + res);
        })
      

      
      
      // escrow.deployed().then((instance) => {
      //   escrowInstance = instance

      //   console.log(escrowInstance);

      //   let itemPrice = parseInt(this.state.item.price) / usdPrice;

      //   console.log(itemPrice);

      //   // deposits the item price into escrow
      //   // return simpleStorageInstance.set(5, {from: accounts[0]})
      // }).then((result) => {
      //   // Get the amount of eth stored to confirm that it worked
        
        
      //   // return simpleStorageInstance.get.call(accounts[0])
      // })
    });
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
