import React, { Component } from 'react';
import { Link } from 'react-router';
import itemsData from '../../assets/data/items.json';
import postingsData from '../../assets/data/postings.json';
import './styles.sass';

class OpenPosting extends Component {

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

  render() {
    return (
      <div className="ptWrapper">
        <div className="upper">
          <h4>
          <p>{this.getItemName()}</p>
          </h4>
        </div>
        <div className="tradeBtnWrapper lower">
          <button className="declineBtn normalBtn">Remove</button>
        </div>
      </div>
    );
  }
}

export default OpenPosting;
