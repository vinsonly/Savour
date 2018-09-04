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

  handleClick() {
    console.log("marker clicked");
  }

  onPlacesChanged(places) {
    console.log("places changed");
    console.log(places);
    console.log(this.map);
    let _this = this;

    if (places.length == 0) {
      return;
    }

    let map = this.map.current.map_;

    // Clear out the old markers.
    let markers = this.state.markers;
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

      console.log("place", place);

      // Create a marker for each place.
      let marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
      })

      // add popup of location information when clicked
      var infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          place.formatted_address + '</div>'
        );

        infowindow.open(map, this);
        // set location
        _this.props.updateLocation(place);
      });

      console.log("marker", marker);
      window.marker = marker;

      markers.push(marker);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);

    if(places.length == 1) {
      _this.props.updateLocation(places[0]);
    }

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

  componentDidMount() {
    if(this.props.modalIsOpen) {
      this.afterModalOpen();
    }
  }

  componentDidUpdate(prevProps,prevState) {
    if(this.props.modalIsOpen && !prevProps.modalIsOpen) {
      this.afterModalOpen();    
    }
  }

  afterModalOpen() {
    this.handleChange();
    let map = this.map.current.map_;
    let input = document.getElementById('searchInput');
    console.log("input", input);
    console.log("map", map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  }
 
  render() {

    let searchMapStyles = {
      height: '320px',
      width: '100%',
      marginTop: '1rem'
    }

    return (
      // Important! Always set the container height explicitly
      <div style={searchMapStyles}>

        <SearchBox 
          placeholder={"Search for your meeting location"}
          onPlacesChanged={this.onPlacesChanged}
          bounds={this.state.searchBoxBounds}
        />
        <GoogleMap
          bootstrapURLKeys={{ key: "AIzaSyDvtndexGCQLEeLUsklFakSejGOElaVlH8" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={this.handleChange}
          ref={this.map}
        >

        {(this.props.location && this.props.location.lat && this.props.location.lng) ? (
          <GmapsMarker
          lat={this.props.location.lat}
          lng={this.props.location.lng}
        />
        ) : (<div/>)}
          
        </GoogleMap>

      </div>
    );
  }
}

class SearchBox extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }

  static searchInputStyles = {
    margin: 0,
    width: 'calc(100% - 50px)'
  }

  constructor(props) {
    super(props);

    this.state = {
      searchBox: null,
      bounds: props.bounds
    }

    this.onPlacesChanged.bind(this);
  }

  render() {
    return <input id="searchInput" ref="input" {...this.props} type="text" 
      disabled={this.state.bounds && this.state.searchBox}
      style={SearchBox.searchInputStyles}
    />;
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
    }
  }

  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.state.searchBox);
  }
}
 
export default SearchMap;