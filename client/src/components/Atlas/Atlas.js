import React, {Component} from 'react';
import {
    Button,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Row,
    Input,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as distanceSchema from "../../../schemas/DistanceResponse.json";

import LOG from "../../utils/constants"
import Coordinates from "coordinate-parser";

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

        this.toggleCoordinateMenu = this.toggleCoordinateMenu.bind(this);
        this.requestDistanceFromServer = this.requestDistanceFromServer.bind(this);
        this.updateInput1 = this.updateInput1.bind(this);
        this.updateInput2 = this.updateInput2.bind(this);
        this.submitDistanceRequest = this.submitDistanceRequest.bind(this);

        this.state = {
            userPosition: null,
            markerPosition: null,
            secondMarkerPosition: null,
            mapCenter: MAP_CENTER_DEFAULT,
            modal: false,
            input1: null,
            input2: null,
            distanceLabel: null
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
                    {this.renderButtons()}
                    {this.renderCoordinateMenu()}
                </Container>
            </div>
        );
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
                    <Button color="primary" onClick={this.toggleCoordinateMenu}> Find Distance </Button>
                </Col>
            </Row>
        );
    }

    renderCoordinateMenu() {
        return (
            <Row>
                <Col>
                    <Modal isOpen={this.state.modal} toggle={this.toggleCoordinateMenu}
                           className={this.props.className}>
                        <ModalHeader toggle={this.toggleCoordinateMenu}> Distance Between Coordinates </ModalHeader>
                        <ModalBody>
                            {this.renderCoordinateInputs()}
                        </ModalBody>
                        <ModalFooter>
                            <Button className="mr-4" color='primary' onClick={this.toggleCoordinateMenu}> Cancel </Button>
                            <Button color='primary' onClick={this.submitDistanceRequest}> Enter </Button>
                        </ModalFooter>
                    </Modal>
                </Col>
            </Row>
        );
    }

    renderCoordinateInputs() {
        return (
            <div>
                <Row className="ml-2 mr-2 mt-3 mb-4">
                    <Col>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">Point 1</InputGroupAddon>
                            <Input placeholder="0.0, 0.0"
                                   onChange={(e) => () => this.setState({input1: e.target.value})}
                                   value={this.state.input1}/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="ml-2 mr-2 mb-3">
                    <Col>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">Point 2</InputGroupAddon>
                            <Input placeholder="0.0, 0.0"
                                   onChange={(e) => () => this.setState({input2: e.target.value})}
                                   value={this.state.input2}/>
                        </InputGroup>
                    </Col>
                </Row>
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

    toggleCoordinateMenu() {
        this.setState({modal: !this.state.modal});
    }

    setMarker(mapClickInfo) {
        if (!this.state.markerPosition) {
            this.setState({
                markerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng
            });
        } else if (!this.state.secondMarkerPosition) {
            this.setState({
                secondMarkerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng
            });
        } else {
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

    isValidPosition(position) {
        let isValid;
        try {
            isValid = true;
            new Coordinates(position);
            return isValid;
        } catch (error) {
            isValid = false;
            return isValid;
        }
    };

    updateInput1() {
        if (this.isValidPosition(this.state.input1)) {
            const position1 = new Coordinates(this.state.input1);
            const coord1 = {lat: position1.getLatitude(), lng: position1.getLongitude()};

            this.setState({markerPosition: coord1});
        } else {
            this.setState({markerPosition: {lat: 10, lng: -35}});
        }

    }

    updateInput2() {
        if (this.isValidPosition(this.state.input2)) {
            const position2 = new Coordinates(this.state.input2);
            const coord2 = {lat: position2.getLatitude(), lng: position2.getLongitude()};

            this.setState({secondMarkerPosition: coord2});
        } else {
            this.setState({secondMarkerPosition: {lat: -10, lng: 36}});
        }

    }

    submitDistanceRequest() {
        this.updateInput1();
        this.updateInput2();

        this.requestDistanceFromServer();
    }

    requestDistanceFromServer() {
        let place1Pos = {latitude: this.state.markerPosition["lat"], longitude: this.state.markerPosition["lng"]};
        let place2Pos = {
            latitude: this.state.secondMarkerPosition["lat"],
            longitude: this.state.secondMarkerPosition["lng"]
        };
        let distResult = null;
        sendServerRequest({
            requestType: "distance",
            requestVersion: 2,
            place1: place1Pos,
            place2: place2Pos,
            earthRadius: 3959.0
        })
            .then(distance => {
                if (distance) {
                    if (this.validDistanceResponse(distance.data)) {
                        distResult = distance;
                    }
                } else {
                    this.setState({distanceLabel: null});
                }
            });
        this.setState({distanceLabel: distResult});
        LOG.info(distResult);
    }

    validDistanceResponse(distance) {
        return isJsonResponseValid(distance, distanceSchema);
    }
}
