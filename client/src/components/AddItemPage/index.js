import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchMap from '../SearchMap'; 
import './styles.sass';

class AddItemPage extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      name: "",
      description: "",
      price: 0,
      server: JSON_SERVER
    }
    this.updateValue = this.updateValue.bind(this);
  }

  createPosting() {
    return fetch(this.state.server + "/postings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        price: this.state.price,
        userId: sessionStorage.getItem("userId"),
        itemId: this.state.itemIds
      })
    }).then(function(response){
      console.log(response.json);
      return response.json;
    });
  }

  updateValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  componentDidMount() {
    setTimeout(() => {
      this.modalWrapper.classList.add(this.props.openClass);
    }, 50);
  }

  close() {
    this.modalWrapper.classList.remove(this.props.openClass);
    setTimeout(() => {
      this.props.close();
    }, 850);
  }
  save(){

    console.log("state", this.state);

    // this.createPosting().then(function() {
    //   this.modalWrapper.classList.remove(this.props.openClass);
    // setTimeout(() => {
    //   this.props.close();
    // }, 1000).then(function(){
    //   browserHistory.push('trades');
    // });
    // });
  }

  render() {
    return (
      <div className="addItemWrapper" ref={node => { this.modalWrapper = node; }}>
        <div className="hider" />
        <div className="modal">
          <div className="heading">
            <h3>Add Item</h3>
          </div>
          <div className="itemWrapper">
            <div className="itemPicWrapper">
              <div className="img" />
              <p className="imgText frm">Upload Item Picture</p>
            </div>
            <div className="itemInfoWrapper">
              <div className="inputWrapper">
                <label htmlFor="itemName">Name:</label>
                <input id="itemName" name="name" type="text" placeholder="Enter Name" value={this.state.name} onChange={this.updateValue} required />
              </div>
              <div className="priceWrapper">
                <div className="inputWrapper" style={{margin: 0}}>
                  <label htmlFor="itemPrice">Price: (CAD)</label>
                  <input min="0" id="price" name="price" type="number" placeholder="Enter Price" onChange={this.updateValue} value={this.state.price} required />
                </div>
                {/* <div className="inputWrapper">
                  <label htmlFor="itemCurrency">Currency:</label>
                  <input id="itemCurrency" name="itemId" type="text" className="itemCurrency" placeholder="Enter item id" onChange={this.updateValue} />
                </div> */}
              </div>
              <div className="inputWrapper">
                <label htmlFor="itemDescription">Description:</label>
                <textarea name="description" id="itemDescription" placeholder="Enter Item Description" onChange={this.updateValue} value={this.state.description} />
              </div>
              {/* <div className="inputWrapper">
                <label htmlFor="itemTags">Tags(Comma Separated):</label>
                <textarea name="itemTags" id="itemTags" className="itemTags" placeholder="Enter Tags" />
              </div> */}
              <SearchMap />
            </div>
          </div>
          <div className="buttonWrapper">
            <button className="saveItemBtn" onClick={this.save.bind(this)}>Save</button>
            <button className="cancelItemBtn" onClick={this.close.bind(this)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

AddItemPage.propTypes = {
  close: PropTypes.func,
  openClass: PropTypes.string
};

export default AddItemPage;
