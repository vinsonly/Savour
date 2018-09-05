import React, { Component } from 'react';
import itemsData from '../../assets/data/items.json';
import postingsData from '../../assets/data/postings.json';
import './styles.sass';
import swal from 'sweetalert2';


class OpenPosting extends Component {

  removePosting() {
    let status;
    let data = {
      id: this.props.posting._id
    }
    let _this = this;
    return fetch(`/api/post/delete`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
          'Content-Type':'application/json'
      }
    }).then(res => {
      status = res.status;
      return res.json();
    }).then(body => {
      console.log("body", body);
      console.log("status", status);
      if(status == 200) {
        swal({
          text: `Posting ${body._id} deleted`,
          type: "success"
        })
        _this.props.updatePosts();
      } else {
        swal({
          text: "Failed to delete posting.",
          type: "error"
        })
        console.error(body);
      }
    });
  }

  render() {
    return (
      <div className="ptWrapper">
        <div className="upper">
          <h4>
          <p>{this.props.posting.name}</p>
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
