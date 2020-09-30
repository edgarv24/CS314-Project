import React, {Component} from 'react';
import {Button, Col, Container, Modal, ModalBody, ModalHeader, ModalFooter, Row, Input} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as distanceSchema from "../../../schemas/DistanceResponse.json";

import LOG from "../../utils/constants"
import Coordinates from "coordinate-parser";

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = [40.5734, -105.0865];
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
        this.getUserMarker = this.getUserMarker.bind(this);
        this.toggleValue = this.toggleValue.bind(this);
        this.inputLocations = this.inputLocations.bind(this);
        this.getInput1 = this.getInput1.bind(this);
        this.getInput2 = this.getInput2.bind(this);
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



    toggleValue(){
        this.setState({modal: !this.state.modal});
    }

    componentDidMount() {
        // request user location once after first render
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    markerPosition: {lat: position.coords.latitude, lng: position.coords.longitude},
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
                        <Col className="my-3" sm="12" md={{ size: 6, offset: 5 }}>
                            <Button color="primary" onClick={this.setMapToHome}>
                                Where am I?
                            </Button>{' '}
                            <Button color="primary" onClick={this.toggleValue}> Find Distance </Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggleValue} className={this.props.className}>
                                <ModalHeader toggle={this.toggleValue}> Enter 2 Coordinates </ModalHeader>
                                <ModalBody>
                                    {this.inputLocations()}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='primary' onClick={this.submitDistanceRequest}> Enter </Button>{' '}
                                    <Button color='primary' onClick={this.toggleValue}> Cancel </Button>
                                </ModalFooter>
                            </Modal>
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
                {this.getFirstMarker()}
                {this.getSecondMarker()}
                {this.getUserMarker()}
                {this.renderPolyline()}
                //add box with distance here
            </Map>
        );
    }

    setMarker(mapClickInfo) {
        if(!this.state.markerPosition) {
            this.setState({
                markerPosition: mapClickInfo.latlng,
                mapCenter: mapClickInfo.latlng
            });
        }
        else if (!this.state.secondMarkerPosition) {
            this.setState( {
                secondMarkerPosition: mapClickInfo.latlng,
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

    getFirstMarker() {
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

    getSecondMarker() {
        const initMarker = ref => {
            if (ref) {
                ref.leafletElement.openPopup()
            }
        };

        if (this.state.secondMarkerPosition) {
            return (
                <Marker ref={initMarker} position={this.state.secondMarkerPosition} icon={MARKER_ICON}>
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
            secondMarkerPosition: {lat: homePos[0], lng: homePos[1]},
            mapCenter: homePos
        });
    }

    getHomePosition() {
        if (this.state.userPosition)
            return this.state.userPosition;
        return MAP_CENTER_DEFAULT;
    }

    getUserMarker() {
        if (this.state.userPosition) {
            return (
                <Marker position={this.state.userPosition} icon={DISTINCT_MARKER}>
                    <Popup offset={[0, -18]} className="font-weight-bold">{this.getStringMarkerPosition()}</Popup>
                </Marker>
            );
        }
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

    inputLocations(){
        return (
            <Row className="m-2">
                <Col xs={12}>
                    {this.getInput1()}
                </Col>
                <Col xs={12}>
                    {this.getInput2()}
                </Col>
            </Row>
        );
    }

    getInput1(){
        return(
            <Input placeholder="Enter first coordinates" onChange={(e) => (() => this.setState({input1: e.target.value}))}
                   value={this.state.input1}
            />
        );
    }

    getInput2(){
        return(
            <Input placeholder="Enter second coordinates" onChange={(e) => (() => this.setState({input2: e.target.value}))}
                   value={this.state.input2}
            />
        );
    }

    isValidPosition(position) {
        let error;
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
        if(this.isValidPosition(this.state.input1)){
            const position1 = new Coordinates(this.state.input1);
            const coord1 = {lat: position1.getLatitude(), lng: position1.getLongitude()};

            this.setState({markerPosition: coord1});
        } else{
            this.setState({markerPosition: {lat: 10, lng: -35}});
        }

    }

    updateInput2() {
        if(this.isValidPosition(this.state.input2)){
            const position2 = new Coordinates(this.state.input2);
            const coord2 = {lat: position2.getLatitude(), lng: position2.getLongitude()};

            this.setState({secondMarkerPosition: coord2});
        }else{
            this.setState({secondMarkerPosition: {lat: -10, lng: 36}});
        }

    }

    submitDistanceRequest(){
        this.updateInput1();
        this.updateInput2();

        this.requestDistanceFromServer();
    }

    requestDistanceFromServer(){
        let place1Pos = {latitude: this.state.markerPosition["lat"], longitude: this.state.markerPosition["lng"]};
        let place2Pos = {latitude: this.state.secondMarkerPosition["lat"], longitude: this.state.secondMarkerPosition["lng"]};
        let distResult = null;
        sendServerRequest({requestType: "distance", requestVersion: 2, place1: place1Pos, place2: place2Pos, earthRadius: 3959})
            .then(distance => {
                if (distance) { if(this.validDistanceResponse(distance.data)){ distResult = distance;} }
                else { this.setState({distanceLabel: null}); }
            });
        this.setState({distanceLabel: distResult});
        LOG.info(distResult);
    }

    validDistanceResponse(distance) {
        if(!isJsonResponseValid(distance, distanceSchema)) {
            return false;
        } else {
            return true;
        }
    }
}
