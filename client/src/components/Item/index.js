import React, { Component } from 'react';

import {withRouter} from 'react-router-dom';

import items from '../../assets/data/items.json';

import postings from '../../assets/data/postings.json';

import users from '../../assets/data/users.json';

import './styles.sass';

class Item extends Component {

  render() {
    let post = this.props.post
    return(
      <div className="item">
        <div className="content" id={post._id} onClick={()=>{
          console.log(this.props);
          this.props.history.push('/item/' + post._id);
        }} >
          <img src={post.images[0]}></img>
        </div>
        <p>{post.name} - ${post.price.$numberDecimal}</p>
        <div className="itemInfoFlex">
          <div>{post.seller[0].username}</div>
          {/* <div className="rating">{this.state.posting.rating}</div> */}
        </div>
      </div>
    );
  }

}

export default withRouter(Item);
