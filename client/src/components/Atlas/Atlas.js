import React, {Component} from 'react';
import {Button, Col, Container, Modal, ModalBody, ModalHeader, ModalFooter, Row} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import {sendServerRequest} from "../../utils/restfulAPI";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import Input from "@material-ui/core/Input";

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
        this.inputFindDistance = this.inputFindDistance.bind(this);
        this.state = {
            userPosition: null,
            markerPosition: null,
            secondMarkerPosition: null,
            mapCenter: MAP_CENTER_DEFAULT,
            modal: false,
            value1: null,
            value2: null
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
                        <Col className="my-3" xs={{size: 10, offset: 5}}>
                            <Button color="primary" onClick={this.setMapToHome}>
                                Where am I?
                            </Button>{' '}
                            <Button color="primary" onClick={this.toggleValue}> Find Distance </Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggleValue} className={this.props.className}>
                                <ModalHeader toggle={this.toggleValue}> Enter 2 Coordinates </ModalHeader>
                                <ModalBody>
                                    {this.inputLocations()}
                                    <br/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='primary' onClick={this.inputFindDistance(this.state.value1, this.state.value2)}> Enter </Button>{' '}
                                    <Button color='danger' onClick={this.toggleValue}> Cancel </Button>
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
            <InputGroup>
                <Row>
                    <Col>
                        <Input name="value1" placeholder="Enter longitude, latitude" type="text" onChange={(e) => this.onChange(`${e.target.value}`)}/>
                        <InputGroupAddon addonType="append" >
                        </InputGroupAddon>
                    </Col>
                    <Col>
                        <Input name="value2" placeholder="Enter longitude, latitude" type="text" onChange={(e) => this.onChange(`${e.target.value}`)}/>
                        <InputGroupAddon addonType="append">
                        </InputGroupAddon>
                    </Col>
                </Row>

            </InputGroup>
        );
    }

    inputFindDistance(value1, value2){
        //will call find requestFind and calculate distance
    }
}
