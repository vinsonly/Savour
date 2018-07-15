import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import postingsData from '../../assets/data/postings.json';
import { browserHistory } from 'react-router';
import './styles.sass';

class OpenPosting extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      server: JSON_SERVER
    }
  }
  getPosting(postingId, type) {
    var postings = postingsData['postings'];
    for ( var i in postings) {
      if(postings[i].id == postingId) {
        return postings[i][type];
      }
    }
  }

  getItemInfo(itemId,type) {
    var items = itemsData['items'] 
      for(var i in items) {
        if (items[i].id == itemId) {
          return items[i][type];
        }
      }
  }

  getItemName() {
    var itemId = this.getPosting(this.props.postingId, "itemId");
    return this.getItemInfo(itemId, "name");
  }

  removePosting() {
    return fetch(this.state.server + "postings/" +  this.props.postingId,{
      method: "DELETE"
    }).then(function(response){
      return window.location.reload();
    });
  }

  render() {
    return (
      <div className="ptWrapper">
        <div className="upper">
          <h4>
          <p>{this.getItemName()}</p>
          </h4>
        </div>
        <div className="tradeBtnWrapper lower">
          <button className="declineBtn normalBtn" onClick={this.removePosting.bind(this)}>Remove</button>
        </div>
      </div>
    );
  }
}

export default OpenPosting;
