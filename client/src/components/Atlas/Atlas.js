import React, {Component} from 'react';
import {Button, Col, Container, Row, Input, InputGroup, InputGroupAddon} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import DistanceModal from "./DistanceModal";

import {LOG} from "../../utils/constants"

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

        this.processDistanceRequestSuccess = this.processDistanceRequestSuccess.bind(this);

        this.state = {
            userPosition: null,
            markerPosition: null,
            secondMarkerPosition: null,
            mapCenter: MAP_CENTER_DEFAULT,
            distModalOpen: false,
            distanceLabel: null
        };
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
                {this.state.distanceLabel != null && this.renderPolyline()}
            </Map>
        );
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
                    {this.renderDistanceLabel()}
                    <Row>
                        <Col sm={12} md={{size: 10, offset: 1}}>
                            {this.renderLeafletMap()}
                        </Col>
                    </Row>
                    {this.renderButtons()}
                    {this.state.distModalOpen && this.renderDistanceModal()}
                </Container>
            </div>
        );
    }

    renderDistanceModal() {
        const pos1 = this.state.markerPosition;
        const pos2 = this.state.secondMarkerPosition;

        return (
            <DistanceModal
                isOpen={this.state.distModalOpen}
                toggleOpen={(isOpen = !this.state.distModalOpen) => this.setState({distModalOpen: isOpen})}
                processDistanceRequestSuccess={this.processDistanceRequestSuccess}
                input1={pos1 ? `${pos1["lat"]}, ${pos1["lng"]}` : ""}
                input2={pos2 ? `${pos2["lat"]}, ${pos2["lng"]}` : ""}
            />
        );
    }

    renderDistanceLabel() {
        return (
            <Row className="mb-3">
                <Col sm={12} md={{size: 10, offset: 1}}>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend"> Distance </InputGroupAddon>
                        <Input disabled={true}
                               value={this.getDistanceLabelText()}/>
                    </InputGroup>
                </Col>
            </Row>
        );
    }

    getDistanceLabelText() {
        if (this.state.distanceLabel === null)
            return "N/A";
        else if (this.state.distanceLabel === 1)
            return "1 mile";
        return `${this.state.distanceLabel} miles`;
    }

    renderButtons() {
        return (
            <Row className="text-center">
                <Col className="my-3" xs={{size: 5, offset: 1}}>
                    <Button color="primary" onClick={this.setMapToHome}>
                        Where am I?
                    </Button>{' '}
                </Col>
                <Col className="my-3" xs={{size: 5, offset: 0}}>
                    <Button color="primary" onClick={() => this.setState({distModalOpen: true})}> Find
                        Distance </Button>
                </Col>
            </Row>
        );
    }

    setMarker(mapClickInfo) {
        if (!this.state.markerPosition) {
            this.setState({
                markerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng,
                distanceLabel: null
            });
        } else if (!this.state.secondMarkerPosition) {
            this.setState({
                secondMarkerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng,
                distanceLabel: null
            });
        } else {
            this.setState({
                markerPosition: this.state.secondMarkerPosition,
                secondMarkerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng,
                distanceLabel: null
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
                    <Popup offset={[0, -18]}
                           className="font-weight-bold">{this.getStringMarkerPosition(position)}</Popup>
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

    processDistanceRequestSuccess(coordinate1, coordinate2, distance) {
        const c1 = `(${coordinate1["lat"]}, ${coordinate1["lng"]})`;
        const c2 = `(${coordinate2["lat"]}, ${coordinate2["lng"]})`;
        LOG.info(`Distance between ${c1} and ${c2} = ${distance}`);
        this.setState({
            markerPosition: coordinate1, secondMarkerPosition: coordinate2,
            distanceLabel: distance, mapCenter: coordinate2
        });
    }

    processRequestError(message) {
        LOG.error(message);
        this.props.createSnackBar(message);
    }
}