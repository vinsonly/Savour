import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import './styles.css';

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

        {/* <GoogleMapReact
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
        </GoogleMapReact> */}
         <SearchBox 
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
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <input id="pac-input" className="controls" type="text" placeholder="Search Box" />
        <div id="map" style={{ height: '100%', width: '100%' }}/>
      </div>
    );
  }
  onPlacesChanged = () => {
    console.log("places changed, searchbox")
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  setUpMap() {
    let _this = this

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
  
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    this.searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', function() {
      _this.searchBox.setBounds(_this.map.getBounds());
    });
  
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    this.searchBox.addListener('places_changed', function() {
      var places = _this.searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });

      markers = [];
  
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
  
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: _this.map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      _this.map.fitBounds(bounds);
    });
    
  }

  componentDidMount() {
    let _this = this;
    setTimeout(function() {
      _this.setUpMap();
    }, 0);  
    
  }

  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
    google.maps.event.clearInstanceListeners(this.map);
  }
}
 
export default SearchMap;