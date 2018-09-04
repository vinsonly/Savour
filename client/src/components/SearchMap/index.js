import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import GoogleMap from 'google-map-react';
import './styles.css';

const google = window.google;

const GmapsMarker = ({ text }) => {

    let markerIconStyles = {
        color: "red",
        height: "20px",
        width: "20px"
    }

    let markerStyles = {
      position: 'absolute',
      transform: 'translate(-50%, -100%)'
    }

    return(
      <div style={markerStyles}>
        <i style={markerIconStyles} className="material-icons">
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

    this.state = {
      searchBoxBounds: null
    }

    this.map = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
  }

  onPlacesChanged(getPlaces) {
    console.log("places changed");
    console.log(getPlaces);
    console.log(this.map);
  }

  handleChange() {
    try {
      console.log("bounds changed");
      let map = this.map.current.map_;
      console.log("map", map);   
      console.log("bounds", map.getBounds());
      this.setState({
        searchBoxBounds: map.getBounds()
      })

    } catch (err) {
      console.error(err);
    }
    
  }
 
  render() {
    var myLatLng = {lat: 49.286610, lng: -123.136516};

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50%', width: '100%' }}>

        <GoogleMap
          bootstrapURLKeys={{ key: "AIzaSyDvtndexGCQLEeLUsklFakSejGOElaVlH8" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={this.handleChange}
          ref={this.map}
        >
          <GmapsMarker
            lat={49.286610}
            lng={-123.136516}
            text={"O"}
          />
        </GoogleMap>

         {/* <SearchBox 
        /> */}
        <SearchBox2 
          placeholder={"Search Box"}
          onPlacesChanged={this.onPlacesChanged}
          bounds={this.state.searchBoxBounds}
        />
      </div>
    );
  }
}

class SearchBox extends React.Component {
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

class SearchBox2 extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }
  render() {
    return <input ref="input" {...this.props} type="text"/>;
  }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }
  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}
 
export default SearchMap;