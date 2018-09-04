import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import LocationOn from '@material-ui/icons/LocationOn';

const google = window.google;

const GmapsMarker = ({ text }) => {

    let gMapsStyles = {
        color: "red",
        height: "20px",
        width: "20px"
    }

    return(
      <div>
        <i style={gMapsStyles} className="material-icons">
          location_on
        </i>
      </div>
    );
}
 
class SearchMap extends Component {
  static defaultProps = {
    center: {
      lat: 49.286610,
      lng: -123.136516
    },
    zoom: 15
  };

  constructor(props) {
    super(props);

    this.map = React.createRef();
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
  }

  onPlacesChanged(getPlaces) {
    console.log("places changed");
    console.log(getPlaces);
    console.log(this.map);
  }
 
  render() {
    var myLatLng = {lat: 49.286610, lng: -123.136516};

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50%', width: '100%' }}>

        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDvtndexGCQLEeLUsklFakSejGOElaVlH8" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          ref={this.map}
        >
          <GmapsMarker
            lat={49.286610}
            lng={-123.136516}
            text={"O"}
          />
        </GoogleMapReact>
        <SearchBox 
          placeholder={"Search for a location"}
          onPlacesChanged={this.onPlacesChanged}
          map={this.map}
        />
      </div>
    );
  }
}

class SearchBox extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      setMap: false
    }
    this.setUpMap = this.setUpMap.bind(this);
  }

  render() {
    return <input ref={this.input} placeholder={this.props.placeholder} type="text"/>;
  }
  onPlacesChanged = () => {
    console.log("places changed, searchbox")
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  setUpMap() {

    console.log("this.props.map", this.props.map);
    console.log("current map", this.props.map.current);
    window.current = this.props.map.current;
    let _this = this;
    setTimeout(function() {
      console.log("current map map", window.current.map_);
      let map_ = _this.props.map.current;
      
      var input = _this.input.current;
      console.log("input", input);
      this.searchBox = new google.maps.places.SearchBox(input);
      this.searchBox.addListener('places_changed', _this.onPlacesChanged);
       // Bias the SearchBox results towards current map's viewport.
      map_.addListener('bounds_changed', function() {
        _this.searchBox.setBounds(map_.getBounds());
      });
      window.searchBox = this.searchBox;
    }, 2000);

   
  }

  componentDidMount() {
    this.setUpMap();
  }

  componentDidUpdate() {
    this.setUpMap();
  }

  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}
 
export default SearchMap;