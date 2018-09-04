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
      searchBoxBounds: null,
      markers: []
    }

    this.map = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
  }

  onPlacesChanged(places) {
    console.log("places changed");
    console.log(places);
    console.log(this.map);

    if (places.length == 0) {
      return;
    }

    let map = this.map.current.map_;

    // Clear out the old markers.
    let markers = [];

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
        map: map,
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
    map.fitBounds(bounds);
    this.setState({
      markers: markers
    });
  
  }

  handleChange() {
    try {
      console.log("bounds changed");
      console.log("this.map", this.map);
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

        <SearchBox2 
          placeholder={"Search Box"}
          onPlacesChanged={this.onPlacesChanged}
          bounds={this.state.searchBoxBounds}
        />
      </div>
    );
  }
}

class SearchBox2 extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      searchBox: null
    }

    this.onPlacesChanged.bind(this);
  }

  render() {
    return <input ref="input" {...this.props} type="text"/>;
  }
  
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.state.searchBox.getPlaces());
    }
  }

  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.input);
    let searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', this.onPlacesChanged);
    if(this.props.bounds) {
      searchBox.setBounds(this.props.bounds);
    }
    window.searchBox = searchBox;
    this.setState({
      searchBox: searchBox
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.bounds && (JSON.stringify(prevProps.bounds) != JSON.stringify(this.props.bounds))) {
      let searchBox = this.state.searchBox;
      searchBox.setBounds(this.props.bounds);
      this.setState({
        searchBox: searchBox
      })
      window.searchBox = searchBox
    }
    
    window.bounds = this.props.bounds; 
  }

  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}
 
export default SearchMap;