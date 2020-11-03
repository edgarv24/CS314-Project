import React, {Component, createRef} from 'react';
import {Col, Container, Row, Input, InputGroup, InputGroupAddon} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Control from 'react-leaflet-control';
import 'leaflet/dist/leaflet.css';

import blue_icon from 'leaflet/dist/images/marker-icon.png';
import red_icon from '../../static/images/markers/marker-icon-red.png';
import gold_icon from '../../static/images/markers/marker-icon-gold.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import {Paper} from '@material-ui/core';
import {IconButton, Tooltip, Zoom} from '@material-ui/core';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import SearchIcon from '@material-ui/icons/Search';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RemoveIcon from '@material-ui/icons/Remove';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Trip from "./Trip";
import Itinerary from "./Itinerary/Itinerary";
import DistanceModal from "./Modals/DistanceModal";
import FindModal from "./Modals/FindModal";

import {LOG} from "../../utils/constants";
import {TrendingUp} from "@material-ui/icons";

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = {lat: 40.5734, lng: -105.0865};
const BLUE_MARKER = L.icon({iconUrl: blue_icon, shadowUrl: iconShadow, iconAnchor: [12, 40]});
const RED_MARKER = L.icon({iconUrl: red_icon, shadowUrl: iconShadow, iconAnchor: [12, 40]});
const GOLD_MARKER = L.icon({iconUrl: gold_icon, shadowUrl: iconShadow, iconAnchor: [12, 40]});

const MAP_LAYER_ATTRIBUTION = "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors";
const MAP_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 19;
const MAP_DEFAULT_ZOOM = 15;

export default class Atlas extends Component {

    constructor(props) {
        super(props);
        this.mapRef = createRef();

        this.setMarker = this.setMarker.bind(this);
        this.setMapToHome = this.setMapToHome.bind(this);
        this.getHomePosition = this.getHomePosition.bind(this);
        this.processDistanceRequestSuccess = this.processDistanceRequestSuccess.bind(this);
        this.processFindRequestViewLocation = this.processFindRequestViewLocation.bind(this);

        this.state = {
            trip: new Trip(),
            userPosition: null,
            markerPosition: null,
            secondMarkerPosition: null,
            mapCenter: MAP_CENTER_DEFAULT,
            mapBounds: null,
            zoomLevel: MAP_DEFAULT_ZOOM,
            distModalOpen: false,
            findModalOpen: false,
            distanceLabel: null,
            displayTripMarkers: true,
            displayTripLines: false,
            optimizeEnabled: false
        };
    }

    renderLeafletMap() {
        return (
            <Map
                className={'mapStyle'}
                ref={this.mapRef}
                boxZoom={false}
                useFlyTo={true}
                bounds={this.state.mapBounds}
                boundsOptions={{padding: [100, 100], maxZoom: 15}}
                viewport={{
                    center: this.state.mapCenter
                }}
                zoom={this.state.zoomLevel}
                minZoom={MAP_MIN_ZOOM}
                maxZoom={MAP_MAX_ZOOM}
                maxBounds={MAP_BOUNDS}

                onClick={this.setMarker}
            >
                <TileLayer url={MAP_LAYER_URL} attribution={MAP_LAYER_ATTRIBUTION}/>
                {this.renderMapButtons()}
                {this.renderMapMarkers()}
                {this.renderPolylines()}
            </Map>
        );
    }

    renderMapButtons() {
        const MAP_BUTTONS = this.getMapButtons();
        return (
            <>
                {MAP_BUTTONS.map((data) => {
                    return <MapButton key={data[0]} buttonID={data[0]} buttonIcon={data[1]}
                                      mapPosition={data[2]} tooltipText={data[3]} tooltipPlacement={data[4]}
                                      disabled={data[5]} toggledOn={data[6]} onClick={data[7]}/>
                })}
            </>
        );
    }

    getMapButtons() {
        const [TL, TR, BL, BR] = ['topleft', 'topright', 'bottomleft', 'bottomright'];
        const [TOOLTIP_LEFT, TOOLTIP_RIGHT] = ['left', 'right'];
        const NO_TRIP_DATA = this.state.trip.places.length === 0;
        const MARKERS_ON = !NO_TRIP_DATA && this.state.displayTripMarkers;
        const LINES_ON = !NO_TRIP_DATA && this.state.displayTripLines;
        return [
            ['home-button', <GpsFixedIcon/>, TL, 'Where am I?', TOOLTIP_RIGHT, false, true,
                () => this.setMapToHome()],
            ['distance-button', <LinearScaleIcon/>, TL, '2 Point Distance', TOOLTIP_RIGHT, false, true,
                () => this.setState({distModalOpen: true})],
            ['find-button', <SearchIcon/>, TL, 'Find Place by Name', TOOLTIP_RIGHT, false, true,
                () => this.setState({findModalOpen: true})],
            ['toggle-trip-markers', <LocationOnIcon/>, BL, 'Toggle Trip Markers', TOOLTIP_RIGHT, NO_TRIP_DATA, MARKERS_ON,
                () => this.setState({displayTripMarkers: !this.state.displayTripMarkers})],
            ['toggle-trip-lines', <RemoveIcon/>, BL, 'Toggle Trip Lines', TOOLTIP_RIGHT, NO_TRIP_DATA, LINES_ON,
                () => this.setState({displayTripLines: !this.state.displayTripLines})],
            ['scroll-down-button', <ArrowDownwardIcon/>, TR, 'Itinerary', TOOLTIP_LEFT, false, true,
                () => document.getElementById('itinerary').scrollIntoView({'behavior': 'smooth'})],
            ['optimize-button', <TrendingUp/>, TR, 'Optimize', TOOLTIP_LEFT, false, this.state.optimizeEnabled,
                () => this.setState({optimizeEnabled: true})],];
    }

    renderMapMarkers() {
        const placeData = this.state.trip.itineraryPlaceData;
        return (
            <>
                {this.state.displayTripMarkers && this.state.trip.coordinatesList.map((position, index) =>
                    this.getMarker(position, GOLD_MARKER, false, placeData[index].id)
                )};
                {this.getMarker(this.state.markerPosition, BLUE_MARKER, true, "first")}
                {this.getMarker(this.state.secondMarkerPosition, BLUE_MARKER, true, "second")}
                {this.getMarker(this.state.userPosition, RED_MARKER, false, "user")}
            </>
        );
    }

    renderPolylines() {
        const placeData = this.state.trip.itineraryPlaceData;
        return (
            <>
                {this.state.displayTripLines && this.getPairsForPolylines().map((pair, index) =>
                    this.renderPolyline(pair[0], pair[1], "green", false, placeData[index].id + "-line")
                )};

                {this.state.distanceLabel != null && this.renderPolyline(
                    this.state.markerPosition, this.state.secondMarkerPosition, "red", true, "twoPoint")}
            </>
        );

    }

    getPairsForPolylines() {
        const coordinates = this.state.trip.coordinatesList;
        const numCoords = coordinates.length;
        if (coordinates.length < 2)
            return [];

        let pairs = [];
        for (let i = 0; i < coordinates.length; i++)
            pairs.push([coordinates[i], coordinates[(i+1) % numCoords]]);
        return pairs;
    }

    componentDidMount() {
        // request user location once after first render
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const homePosition = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.setState({
                    userPosition: homePosition,
                    markerPosition: homePosition,
                    mapCenter: homePosition,
                    mapBounds: null
                })
            });
        }
    }

    render() {
        return (
            <Container id="atlas">
                {this.renderDistanceLabel()}
                <Row>
                    <Col sm={12} md={{size: 10, offset: 1}}>
                        {this.renderLeafletMap()}
                    </Col>
                </Row>
                {this.renderItinerary()}
                {this.state.distModalOpen && this.renderDistanceModal()}
                {this.state.findModalOpen && this.renderFindModal()}
            </Container>
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
        else if (this.state.distanceLabel === "1")
            return "1 mile";
        return `${this.state.distanceLabel} miles`;
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

    renderFindModal() {
        return (
            <FindModal
                isOpen={this.state.findModalOpen}
                toggleOpen={(isOpen = !this.state.findModalOpen) => this.setState({findModalOpen: isOpen})}
                processFindRequestViewLocation={this.processFindRequestViewLocation}
            />
        );
    }

    renderItinerary() {
        return (
            <Row className="mt-4">
                <Col sm={12} md={{size: 10, offset: 1}} lg={{size: 8, offset: 2}}>
                    <Itinerary trip={this.state.trip} setTrip={(newTrip) => this.setState({trip: newTrip})}/>
                </Col>
            </Row>
        );
    }

    setMarker(mapClickInfo) {
        let newMarkerPosition = this.state.markerPosition;
        let newMarkerPosition2 = this.state.secondMarkerPosition;

        if (!this.state.markerPosition) {
            newMarkerPosition = mapClickInfo.latlng;
        } else if (!this.state.secondMarkerPosition) {
            newMarkerPosition2 = mapClickInfo.latlng;
        } else {
            newMarkerPosition = this.state.secondMarkerPosition;
            newMarkerPosition2 = mapClickInfo.latlng;
        }

        this.setState({
            markerPosition: newMarkerPosition,
            secondMarkerPosition: newMarkerPosition2,
            mapCenter: mapClickInfo.latlng,
            mapBounds: this.getMapBounds(newMarkerPosition, newMarkerPosition2),
            zoomLevel: (this.mapRef.current) ? this.mapRef.current.leafletElement.getZoom() : MAP_DEFAULT_ZOOM,
            distanceLabel: null
        });
    }

    getMarker(position, iconStyle, usePopup, key) {
        const initMarker = ref => {
            if (ref && usePopup) {
                ref.leafletElement.openPopup()
            }
        };

        if (position) {
            return (
                <Marker key={key} ref={initMarker} position={position} icon={iconStyle}>
                    <Popup offset={[0, -18]}
                           className="font-weight-bold">{this.getStringMarkerPosition(position)}</Popup>
                </Marker>
            );
        }
    }

    getStringMarkerPosition(position) {
        return position.lat.toFixed(2) + ', ' + position.lng.toFixed(2);
    }

    renderPolyline(position1, position2, color, usePopup, key) {
        const initMarker = ref => {
            if (ref && usePopup) {
                ref.leafletElement.openPopup()
            }
        };

        if (position1 && position2) {
            return (
                <Polyline key={key} ref={initMarker} color={color} positions={
                    [[position1.lat, position1.lng], [position2.lat, position2.lng]]}>
                    <Popup offset={[0, -1]} className="font-weight-bold">Distance: {this.getDistanceLabelText()}</Popup>
                </Polyline>
            );
        }
    }

    setMapToHome() {
        let homePos = this.getHomePosition();
        if (this.state.secondMarkerPosition !== homePos) {
            this.setState({
                markerPosition: this.state.secondMarkerPosition,
                secondMarkerPosition: homePos,
                mapCenter: homePos,
                mapBounds: null,
                zoomLevel: (this.mapRef.current) ? this.mapRef.current.leafletElement.getZoom() : MAP_DEFAULT_ZOOM,
                distanceLabel: null
            });
        }
    }

    getHomePosition() {
        if (this.state.userPosition)
            return this.state.userPosition;
        return MAP_CENTER_DEFAULT;
    }

    getMapBounds(markerLatLng1, markerLatLng2) {
        let latLongArray;
        if (markerLatLng1 && markerLatLng2)
            latLongArray = [markerLatLng1, markerLatLng2];
        else if (markerLatLng1)
            latLongArray = [markerLatLng1];
        else
            latLongArray = [MAP_CENTER_DEFAULT];
        return L.latLngBounds(latLongArray);
    }

    processFindRequestAddToTrip(placeData) {
        // do a setState with trip to addDestination
        // ex) this.setState({setOtherStateVars..., trip: this.state.trip.addDestination(placeData)});
    }

    processFindRequestViewLocation(selectPlace) {
        // do a setState to change map center or bounds, or something like setMapToHome to move markers
        this.setState({
            markerPosition: this.state.secondMarkerPosition,
            secondMarkerPosition: selectPlace,
            mapCenter: selectPlace
        });
    }

    processDistanceRequestSuccess(coordinate1, coordinate2, distance) {
        const c1 = `(${coordinate1["lat"]}, ${coordinate1["lng"]})`;
        const c2 = `(${coordinate2["lat"]}, ${coordinate2["lng"]})`;
        LOG.info(`Distance between ${c1} and ${c2} = ${distance}`);
        this.setState({
            markerPosition: coordinate1, secondMarkerPosition: coordinate2,
            distanceLabel: distance,
            mapCenter: (this.mapRef.current) ? this.mapRef.current.leafletElement.getCenter() : MAP_CENTER_DEFAULT,
            mapBounds: this.getMapBounds(coordinate1, coordinate2),
            zoomLevel: (this.mapRef.current) ? this.mapRef.current.leafletElement.getZoom() : MAP_DEFAULT_ZOOM
        });
    }
}

const MapButton = ({buttonID, buttonIcon, mapPosition, tooltipText, tooltipPlacement, disabled, toggledOn, onClick}) => {
    const ICON_COLOR = toggledOn ? undefined : blueGrey[200];
    return (
        <Control position={mapPosition}>
            <Tooltip title={tooltipText} placement={tooltipPlacement} TransitionComponent={Zoom} arrow>
                <Paper elevation={4}>
                    <IconButton id={buttonID} onClick={onClick} disabled={disabled} size="small"
                                color="inherit" style={{ color: ICON_COLOR }}>
                            {buttonIcon}
                    </IconButton>
                </Paper>
            </Tooltip>
        </Control>
    );
}
