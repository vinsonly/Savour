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
    zoom: 15
  };
 
  render() {

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDvtndexGCQLEeLUsklFakSejGOElaVlH8" }}
          defaultCenter={{
            lat: parseFloat(this.props.lat),
            lng: parseFloat(this.props.lng)
                }}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={parseFloat(this.props.lat)}
            lng={parseFloat(this.props.lng)}
            />


        </GoogleMapReact>
      </div>
    );
  }
}
 
export default Map;