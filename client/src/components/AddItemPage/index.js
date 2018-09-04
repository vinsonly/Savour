import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchMap from '../SearchMap'; 
import './styles.sass';
import swal from 'sweetalert2';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

class AddItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: 0,
      images: [],
      errMsgs: [],
      status: "",
      modalIsOpen: false
    }
    this.updateValue = this.updateValue.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
    this.validatePost = this.validatePost.bind(this);
    this.post = this.post.bind(this);
  }

  updateValue(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  updateLocation(place) {
    this.setState({
      location: {
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id
      }
    })
  }
  
  handleImageSubmit(base64) {
    let _this = this;
    let data = {
        image: base64
    };
    let status;

    this.setState({
        status: "Uploading image(s)..."
    });

    fetch('https://api.imgur.com/3/image', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json',
            'Authorization': "Client-ID 05c586b02aba2e1"
        }
      })
    .then(res => {
        status = res.status;
        return res.json();
    })
    .then(body => {
        if(status != 200) {
            _this.setState({
                status: "ImageUploadFailed: Image size is too large"
            })
            console.log("image uploading error");
        } else {
            let newImages = this.state.images;
            newImages.push(body.data.link)
            _this.setState({
                status: "ready",
                images: newImages
            })
            console.log("image upload successful")
        }
    })
  }



  componentDidMount() {
    setTimeout(() => {
      this.modalWrapper.classList.add(this.props.openClass);
      this.setState({
        modalIsOpen: true
      })
    }, 50);
  }

  close() {
    this.modalWrapper.classList.remove(this.props.openClass);
    setTimeout(() => {
      this.props.close();
      this.setState({
        modalIsOpen: false
      })
    }, 850);
  }

  post(){
    let _this = this;
    if(!this.props.user) {
      console.error("User must be logged in to make a post");
      return;
    }

    console.log("state", this.state);
    // do validation checks here
    let isValid = this.validatePost();
    if(!isValid) { return }
    
    let data = {
      ...this.state
    }
    data.userId = this.props.user._id; 
    data.location = JSON.stringify(this.state.location);

    let status;
    fetch('/api/post', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
          'Content-Type':'application/json'
      }
    }).then((res) => {
      status = res.status;
      return res.json()
    }).then(body => {
      console.log("body", body);
      console.log("status", status);

      if(status != 201) {
        console.log("failed to upload");
      } else {
        console.log("uploaded successfully");
        _this.modalWrapper.classList.remove(this.props.openClass);
        swal({
          type: "success",
          text: "Item successfully posted."
        })
        setTimeout(() => {
          _this.props.close();
        }, 1000)
      }
    })

  }

  validatePost() {
    let errMsgs = [];
    if(!this.state.name || this.state.name.length < 2) {
      errMsgs.push("Name must be at least two characters long")
    }

    if(parseFloat(this.state.price) < 0) {
      errMsgs.push("Price must be greater than or equal to 0");
    }

    if(!(this.state.location && this.state.location.name && this.state.location.address)) {
      errMsgs.push("You must select a valid location");
    }

    if(!(this.state.images && this.state.images.length > 0)) {
      errMsgs.push("You must add a photo"); 
    }

    if(this.state.status == "Uploading image(s)...") {
      errMsgs.push("Upload in progress, please wait.");
    }

    this.setState({
      errMsgs: errMsgs
    })

    if(errMsgs.length !== 0) {
      return false
    }
    return true
  }

  render() {
    let locationValue;

    if(this.state.location && this.state.location.name && this.state.location.address) {
      locationValue = `${this.state.location.name}, ${this.state.location.address}`
    } else {
      locationValue = "No location selected";
    }

    return (
      <div className="addItemWrapper" ref={node => { this.modalWrapper = node; }}>
        <div className="hider" />
        <div className="modal">
          <div className="heading">
            <h3>Add Item</h3>
          </div>
          <div className="itemWrapper">
            <div className="itemPicWrapper">
              {(this.state.images && this.state.images.length > 0) ? (
                <img src={this.state.images[0]} className="img"/> 
              ): (<div className="img" />)}
              <p className="imgText frm">Upload Item Picture</p>
              <Accept handleSubmit={this.handleImageSubmit}/>
              <p className="imgUploadStatus">{this.state.status}</p>
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
                <textarea name="description" id="itemDescription" placeholder="Enter Item Description" onChange={this.updateValue} value={this.state.description} style={{resize:'vertical'}}/>
              </div>
              {/* <div className="inputWrapper">
                <label htmlFor="itemTags">Tags(Comma Separated):</label>
                <textarea name="itemTags" id="itemTags" className="itemTags" placeholder="Enter Tags" />
              </div> */}
              <div className="inputWrapper">
                <label>Location: {locationValue}</label>
                <SearchMap
                  modalIsOpen={this.state.modalIsOpen}
                  updateLocation={this.updateLocation}
                  location={this.state.location}
                />
              </div>
              <div className="inputWrapper">
                {(this.state.errMsgs).map((err, index) => {
                  return <p className="errMsg" key={index}>{err}</p>
                })}
              </div>
            </div>
          </div>
          <div className="buttonWrapper">
            <button className="saveItemBtn" onClick={this.post.bind(this)}>Post</button>
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

class Accept extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          accepted: [],
          rejected: [],
          acceptedBase64: []
      }

      this.onDrop = this.onDrop.bind(this);

  }

  async onDrop(accepted, rejected) {

      let acceptedBase64 = [];

      let props = this.props;

      if(rejected.length > 0) {
          swal("Only jpg, jpeg, and png files are accepted.");
      }

      if(accepted.length > 0) {
          accepted.forEach(file => {
              console.log(file);

              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = function() {
                  // console.log(reader.result);
                  let base64 = removeFirstChars(reader.result, file.type);
                  // console.log(base64)

                  acceptedBase64.push(base64);

                  props.handleSubmit(base64);
              }
          })
      }

      this.setState({ accepted, rejected });
  }

  render() {

      window.state = this.state;
      
      const dropZoneStyles = {
        width: 'calc(100% - 20px)',
        height: '100px',
        border: 'dashed 2px lightgrey',
        padding: '10px'
      }

      return (
      <section>
          <div className="dropzone">
          <Dropzone
              accept="image/jpeg, image/png"
              onDrop={this.onDrop}
              style={dropZoneStyles}
          >
              <p id="dropDescription">Drop jpg or png images here</p>
          </Dropzone>
          </div>
          <aside>
          </aside>
      </section>
      );
  }
}


export default connect(mapStateToProps)(AddItemPage);

function removeFirstChars(base64, type) {
  let toRemove = 13 + type.length;
  return base64.substring(toRemove, base64.length);
}

