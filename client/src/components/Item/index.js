import React, { Component } from 'react';
// import {Link} from 'react-router';
import { browserHistory } from 'react-router';

import items from '../../assets/data/items.json';

import postings from '../../assets/data/postings.json';

import users from '../../assets/data/users.json';

import './styles.sass';

class Item extends Component {

  constructor(props) {
    super(props);

    window.items = items;
    window.postings = postings;
    window.users = users;
    window.props = props;

    let thisPosting = postings.postings.find(function(posting) {
      return parseInt(posting.id) == parseInt(props.postingId);
    })

    let thisItem = items.items.find(function(item) {
      return parseInt(item.id) == parseInt(thisPosting.itemId);
    })

    let thisUser = users.users.find(function(user){
      return parseInt(user.id) == parseInt(thisPosting.userId);
    })

    this.state = {
      id: this.props.postingId,
      item: thisItem,
      user: thisUser
    }
  }

  render() {

    window.state = this.state;

    let picUrl = this.state.item.picture;

    return(
      <div className="item">
        <div className="content" id={this.state.id} onClick={()=>{
          browserHistory.push('/item/' + this.state.id);
        }} >
          <img src={picUrl}></img>
        </div>
        <p>{this.state.item.name} - ${this.state.id}</p>
        <div className="itemInfoFlex">
          <div>{this.state.user.name}</div>
          <div className="rating">{this.state.user.rating}</div>
        </div>
      </div>
    );
  }

}

export default Item;
