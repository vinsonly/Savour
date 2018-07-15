import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => {

    let gMapsStyles = {
        backgroundColor: "red",
        height: "20px",
        width: "20px",
        borderRadius: "50%"
    }

    return(<div style={gMapsStyles} className="gMapsMarker"></div>);
}
 
class Map extends Component {
  static defaultProps = {
    center: {
      lat: 49.286610,
      lng: -123.136516
    },
    zoom: 15
  };
 
  render() {
    var myLatLng = {lat: 49.286610, lng: -123.136516};

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyApF1SHbXduNze6A4Jfs-nKjLYzuyBiNTs" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={49.286610}
            lng={-123.136516}
            text={"O"}
          />


        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;