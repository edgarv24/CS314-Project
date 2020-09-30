import React, {Component} from 'react';
import {Button, Col, Container, Row} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = {lat: 40.5734, lng: -105.0865};
const MARKER_ICON = L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 40]});
const DISTINCT_MARKER = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: iconShadow,
    iconAnchor: [12, 40],
});
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
            secondMarkerPosition: null,
            mapCenter: MAP_CENTER_DEFAULT
        };
    }

    componentDidMount() {
        // request user location once after first render
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    userPosition: {lat: position.coords.latitude, lng: position.coords.longitude},
                    markerPosition: {lat: position.coords.latitude, lng: position.coords.longitude},
                    mapCenter: {lat: position.coords.latitude, lng: position.coords.longitude}
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
                {this.getMarker(this.state.markerPosition, MARKER_ICON, true)}
                {this.getMarker(this.state.secondMarkerPosition, MARKER_ICON, true)}
                {this.getMarker(this.state.userPosition, DISTINCT_MARKER, false)}
                {this.renderPolyline()}
            </Map>
        );
    }

    setMarker(mapClickInfo) {
        if (!this.state.markerPosition) {
            this.setState({
                markerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng
            });
        }
        else {
            this.setState({
                markerPosition: this.state.secondMarkerPosition,
                secondMarkerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng
            });
        }
    }

    getMarker(position, iconStyle, usePopup) {
        const initMarker = ref => {
            if (ref && usePopup) {
                ref.leafletElement.openPopup()
            }
        };

        if (position) {
            return (
                <Marker ref={initMarker} position={position} icon={iconStyle}>
                    <Popup offset={[0, -18]} className="font-weight-bold">{this.getStringMarkerPosition(position)}</Popup>
                </Marker>
            );
        }
    }

    getStringMarkerPosition(position) {
        return position.lat.toFixed(2) + ', ' + position.lng.toFixed(2);
    }

    setMapToHome() {
        let homePos = this.getHomePosition();
        this.setState({
            secondMarkerPosition: {lat: homePos["lat"], lng: homePos["lng"]},
            mapCenter: {lat: homePos["lat"], lng: homePos["lng"]}
        });
    }

    getHomePosition() {
        if (this.state.userPosition)
            return this.state.userPosition;
        return MAP_CENTER_DEFAULT;
    }

    renderPolyline() {
        if (this.state.markerPosition && this.state.secondMarkerPosition) {
            return (
                <Polyline color={'red'} positions={
                    [[this.state.markerPosition.lat, this.state.markerPosition.lng],
                    [this.state.secondMarkerPosition.lat, this.state.secondMarkerPosition.lng]]}>
                </Polyline>
            );
        }
    }
}
