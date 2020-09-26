import React, {Component} from 'react';
import {Button, Col, Container, Row} from 'reactstrap';

import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = [40.5734, -105.0865];
const MARKER_ICON = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 40] });
const MAP_LAYER_ATTRIBUTION = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
const MAP_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 19;

export default class Atlas extends Component {

  constructor(props) {
    super(props);
    this.setMarker = this.setMarker.bind(this);
    this.setMapToHome = this.setMapToHome.bind(this);
    this.getHomePosition = this.getHomePosition.bind(this);
    this.state = {
      userPosition: null,
      markerPosition: null,
      mapCenter: MAP_CENTER_DEFAULT
    };
  }

  componentDidMount() {
    // request user location once after first render
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          markerPosition: { lat: position.coords.latitude, lng: position.coords.longitude },
          mapCenter: [position.coords.latitude, position.coords.longitude],
          userPosition: [position.coords.latitude, position.coords.longitude]
        })
      });
    }
  }

  render() {
    return (
        <div>
          <Container>
            <Row>
              <Col sm={12} md={{size: 10, offset: 1}}>
                {this.renderLeafletMap()}
              </Col>
            </Row>
            <Row>
              <Col className="my-3" xs={{size: 10, offset: 5}}>
                <Button color="primary" onClick={this.setMapToHome}>
                  Where am I?
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }

  renderLeafletMap() {
    return (
        <Map
            className={'mapStyle'}
            boxZoom={false}
            useFlyTo={true}
            zoom={15}
            minZoom={MAP_MIN_ZOOM}
            maxZoom={MAP_MAX_ZOOM}
            maxBounds={MAP_BOUNDS}
            viewport={{
              center: this.state.mapCenter
            }}
            onClick={this.setMarker}
        >
          <TileLayer url={MAP_LAYER_URL} attribution={MAP_LAYER_ATTRIBUTION}/>
          {this.getMarker()}
        </Map>
    );
  }

  setMarker(mapClickInfo) {
    this.setState({
      markerPosition: mapClickInfo.latlng,
      mapCenter: mapClickInfo.latlng
    });
  }

  getMarker() {
    const initMarker = ref => {
      if (ref) {
        ref.leafletElement.openPopup()
      }
    };

    if (this.state.markerPosition) {
      return (
          <Marker ref={initMarker} position={this.state.markerPosition} icon={MARKER_ICON}>
            <Popup offset={[0, -18]} className="font-weight-bold">{this.getStringMarkerPosition()}</Popup>
          </Marker>
      );
    }
  }

  getStringMarkerPosition() {
    return this.state.markerPosition.lat.toFixed(2) + ', ' + this.state.markerPosition.lng.toFixed(2);
  }

  setMapToHome() {
    let homePos = this.getHomePosition();

    this.setState({
      markerPosition: { lat: homePos[0], lng: homePos[1] },
      mapCenter: homePos
    });
  }

  getHomePosition() {
    if (this.state.userPosition)
      return this.state.userPosition;
    return MAP_CENTER_DEFAULT;
  }
}
