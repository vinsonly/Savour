import React, { Component } from 'react';
import './styles.sass';
import Item from '../Item/index';
import itemData from "../../assets/data/items.json"
import postings from '../../assets/data/postings.json';

class Homepage extends Component {
  constructor(props) {
    super(props);
    let  JSON_SERVER = 'https://macho-json-server.herokuapp.com/';
    this.state = {
      postings:[],
      server: JSON_SERVER
    };
  }

  getJsonPostingData() {
    return fetch(this.state.server + "postings").then(response => response.json())
      .then(data => this.setState({postings: data}));
  }
  
  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
    this.getJsonPostingData();

  }
  render() {

    console.log(postings);

    return (
      <main className="main">
        {/* {itemData['items'].map((item, i) => <Item itemId={item.id} key={item.id} />)} */}
        {this.state.postings.map((posting, i) => <Item postingId={posting.id} key={posting.id} />)}      
      </main>
    );
  }
}

export default Homepage;
