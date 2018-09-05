import React, { Component } from 'react';
import './styles.sass';
import Item from '../Item/index';
import itemData from "../../assets/data/items.json"
import postings from '../../assets/data/postings.json';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postings:[],
    };
  }

  getPostingData() {
    let status;
    return fetch('/api/posts').then(response => {
      let status = response.status;
      return response.json()
    }).then(data => {
      console.log("data", data);
      this.setState({postings: data})
    });
  }
  
  componentDidMount() {
    document.body.scrollTop = 0;
    document.querySelector('.menu').classList.remove('open');
    this.getPostingData();
  }

  render() {

    console.log(postings);

    return (
      <main className="main">
        {/* {itemData['items'].map((item, i) => <Item itemId={item.id} key={item.id} />)} */}
        {this.state.postings.map((posting, i) => <Item post={posting} key={posting.id} />)}      
      </main>
    );
  }
}

export default Homepage;
