import React, {Component, createRef} from 'react';
import {Button, Col, Container, Row, Input, InputGroup, InputGroupAddon} from 'reactstrap';

import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Control from 'react-leaflet-control';
import 'leaflet/dist/leaflet.css';

import blue_icon from 'leaflet/dist/images/marker-icon.png';
import red_icon from '../../static/images/markers/marker-icon-red.png';
import gold_icon from '../../static/images/markers/marker-icon-gold.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import {Paper} from '@material-ui/core';
import {IconButton, Tooltip, Zoom} from '@material-ui/core';
import {ArrowDownward, GpsFixed, LinearScale, LocationOn, Remove, Search, TrendingUp} from '@material-ui/icons';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Trip from "./Trip";
import Itinerary from "./Itinerary/Itinerary";
import DistanceModal from "./Modals/DistanceModal";
import FindModal from "./Modals/FindModal";
import DestinationModal from "./Modals/DestinationModal";

import {correctUnits, LOG} from "../../utils/constants";

const MAP_BOUNDS = [[-90, -180], [90, 180]];
const MAP_CENTER_DEFAULT = {lat: 40.5734, lng: -105.0865};
const NUM_NON_TRIP_MARKERS = 3;
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
        this.setTrip = this.setTrip.bind(this);
        this.processDistanceRequestSuccess = this.processDistanceRequestSuccess.bind(this);
        this.processFindRequestAddToTrip = this.processFindRequestAddToTrip.bind(this);
        this.processFindRequestViewLocation = this.processFindRequestViewLocation.bind(this);

        this.state = {
            trip: new Trip(),
            userPosition: null,
            markerPosition: null,
            secondMarkerPosition: null,
            selectedMarker: {isTripMarker: false, index: 0},
            mapCenter: MAP_CENTER_DEFAULT,
            mapBounds: null,
            zoomLevel: MAP_DEFAULT_ZOOM,
            distModalOpen: false,
            findModalOpen: false,
            destinationModalOpen: false,
            destinationModalSettings: null,
            distanceLabel: null,
            displayTripMarkers: true,
            displayTripLines: true,
            optimizeEnabled: false
        };
    }

    componentDidMount() {
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
        const DISABLE_OPTIMIZE = NO_TRIP_DATA || this.state.trip.response && this.state.trip.response === '1.0';
        const OPTIMIZE_DISABLE_TEXT = this.state.trip.response === '0.0' ? 'Optimize Trip' : 'Already Optimized';
        return [
            ['home-button', <GpsFixed/>, TL, 'Where am I?', TOOLTIP_RIGHT, false, true,
                () => this.setMapToHome()],
            ['distance-button', <LinearScale/>, TL, '2 Point Distance', TOOLTIP_RIGHT, false, true,
                () => {this.maintainMapPosition(); this.setState({distModalOpen: true});}],
            ['find-button', <Search/>, TL, 'Find Place by Name', TOOLTIP_RIGHT, false, true,
                () => {this.maintainMapPosition(); this.setState({findModalOpen: true});}],
            ['toggle-trip-lines', <Remove/>, BL, 'Toggle Trip Lines', TOOLTIP_RIGHT, NO_TRIP_DATA, LINES_ON,
                () => {this.maintainMapPosition(); this.setState({displayTripLines: !this.state.displayTripLines});}],
            ['toggle-trip-markers', <LocationOn/>, BL, 'Toggle Trip Markers', TOOLTIP_RIGHT, NO_TRIP_DATA, MARKERS_ON,
                () => {this.maintainMapPosition(); this.setState({displayTripMarkers: !this.state.displayTripMarkers});}],
            ['optimize-button', <TrendingUp/>, BR, OPTIMIZE_DISABLE_TEXT, TOOLTIP_LEFT, DISABLE_OPTIMIZE, true,
                async () => {this.maintainMapPosition(); await this.setTrip(this.state.trip.optimize());}],
            ['scroll-down-button', <ArrowDownward/>, TR, 'Itinerary', TOOLTIP_LEFT, false, true,
                () => document.getElementById('itinerary').scrollIntoView({'behavior': 'smooth'})]
        ];
    }

    renderMapMarkers() {
        const placeData = this.state.trip.itineraryPlaceData;
        return (
            <>
                {this.state.displayTripMarkers && this.state.trip.coordinatesList.map((position, index) =>
                    this.getMarker(position, GOLD_MARKER, placeData[index], placeData[index].id, index, true)
                )};
                {this.getMarker(this.state.markerPosition, BLUE_MARKER, null, "first", 1, false)}
                {this.getMarker(this.state.secondMarkerPosition, BLUE_MARKER, null, "second", 2, false)}
                {this.getMarker(this.state.userPosition, RED_MARKER, null, "user", 0, false)}
            </>
        );
    }

    renderPolylines() {
        const placeData = this.state.trip.itineraryPlaceData;
        return (
            <>
                {this.state.displayTripLines && this.getPairsForPolylines().map((pair, index) => {
                    const lineDist = placeData[index + 1].leg_dist;
                    const unitText = correctUnits(this.state.trip.units, parseInt(lineDist));
                    return this.renderPolyline(pair[0], pair[1], "green", false,
                        `${lineDist} ${unitText}`, placeData[index].id + "-line")
                })};

                {this.state.distanceLabel != null && this.renderPolyline(
                    this.state.markerPosition, this.state.secondMarkerPosition, "red", true,
                    this.getDistanceLabelText(), "twoPoint")}
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
                {this.state.destinationModalOpen && this.renderDestinationModal()}
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
        const distance = this.state.distanceLabel;
        if (distance === null)
            return "N/A";
        return `${distance} ${correctUnits(this.state.trip.units, parseInt(distance))}`;
    }

    renderDistanceModal() {
        const pos1 = this.state.markerPosition;
        const pos2 = this.state.secondMarkerPosition;

        return (
            <DistanceModal
                isOpen={this.state.distModalOpen}
                toggleOpen={(isOpen = !this.state.distModalOpen) => this.setState({distModalOpen: isOpen})}
                processDistanceRequestSuccess={this.processDistanceRequestSuccess}
                trip={this.state.trip}
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
                processFindRequestAddToTrip={this.processFindRequestAddToTrip}
            />
        );
    }

    renderDestinationModal() {
        const settings = this.state.destinationModalSettings;
        const placeData = settings ? this.getDestinationModalData(settings) : {};
        const placeIndex = settings ? settings.index : -1;

        return (
            <DestinationModal
                isOpen={this.state.destinationModalOpen}
                toggleOpen={(isOpen = !this.state.destinationModalOpen) =>
                    this.setState({destinationModalOpen: isOpen, destinationModalSettings: null})}
                trip={this.state.trip}
                setTrip={this.setTrip}
                placeData={placeData}
                placeIndex={placeIndex}
            />
        );
    }

    getDestinationModalData(settings) {
        const index = settings.index;
        if (settings.modifyTrip)
            return this.state.trip.itineraryPlaceData[index];

        if (index === 1)
            return {name: '', latitude: this.state.markerPosition.lat, longitude: this.state.markerPosition.lng};
        else if (index === 2)
            return {name: '', latitude: this.state.secondMarkerPosition.lat, longitude: this.state.secondMarkerPosition.lng};
        return {name: 'Home', latitude: this.state.userPosition.lat, longitude: this.state.userPosition.lng};
    }

    renderItinerary() {
        return (
            <Row className="mt-4">
                <Col sm={12} md={{size: 10, offset: 1}} lg={{size: 8, offset: 2}}>
                    <Itinerary trip={this.state.trip} setTrip={this.setTrip}/>
                </Col>
            </Row>
        );
    }

    async setTrip(newTrip) {
        await newTrip.updateDistance();
        this.setState({
            trip: newTrip,
            distanceLabel: null,
            selectedMarker: {isTripMarker: newTrip.places.length > 0, index: 0}});
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
            selectedMarker: {isTripMarker: false, index: 2},
            mapCenter: mapClickInfo.latlng,
            mapBounds: this.getMapBounds(newMarkerPosition, newMarkerPosition2),
            zoomLevel: (this.mapRef.current) ? this.mapRef.current.leafletElement.getZoom() : MAP_DEFAULT_ZOOM,
            distanceLabel: null
        });
    }

    getMarker(position, iconStyle, placeData, key, index, isTripMarker) {
        const sm = this.state.selectedMarker;
        const isSelected = sm && sm.isTripMarker === isTripMarker && sm.index === index

        const initMarker = ref => ref && isSelected && ref.leafletElement.openPopup();
        if (position) {
            const markerIndex = isTripMarker ? index + NUM_NON_TRIP_MARKERS : index;
            return (
                <Marker id={`marker-${markerIndex}`} key={key} ref={initMarker} position={position} icon={iconStyle}
                        onClick={() => {
                            this.maintainMapPosition();
                            this.setState({selectedMarker: {isTripMarker: isTripMarker, index: index}});
                        }}>
                    <Popup offset={[0, -18]} className="font-weight-bold">
                        {this.getPopupLabel(position, placeData)}
                        {this.getPopupButton(index, position, placeData, isTripMarker)}
                    </Popup>
                </Marker>
            );
        }
    }

    getPopupLabel(position, placeData) {
        const latLng = this.getStringMarkerPosition(position);
        if (!placeData) {
            if (position === this.getHomePosition())
                return <div>(You are here)<br />{latLng}</div>;
            return <div>{latLng}</div>;
        }

        const flag = placeData.flag !== "" ? placeData.flag + " " : "";
        return <div>{flag}{placeData.primary_text}<br /><div className="text-muted">{placeData.location_text}</div></div>;
    }

    getPopupButton(index, position, placeData, isTripMarker) {
        const buttonIndex = isTripMarker ? index + NUM_NON_TRIP_MARKERS : index;
        const buttonName = isTripMarker ? 'Edit' : 'Add';
        const editPlace = () => {
            this.maintainMapPosition();
            this.setState({
                destinationModalOpen: true,
                destinationModalSettings: {modifyTrip: isTripMarker, index: index}
            });
        };
        const addPlace = async () => {
            if (placeData == null){
                placeData = this.getDestinationModalData({index: index, modifyTrip: false});
            }
            this.maintainMapPosition();
            await this.processFindRequestAddToTrip(placeData);

            if (index === 1){
                this.setState({
                    markerPosition: null
                })
            }
            if (index === 2){
                this.setState({
                    secondMarkerPosition: null
                })
            }
        };
        return (
            <Button id={`marker-button-${buttonIndex}`} className="mt-2" outline size="sm" color="primary"
                    onClick={isTripMarker ? editPlace : addPlace}>
                {buttonName}
            </Button>
        );
    }

    getStringMarkerPosition(position) {
        return position.lat.toFixed(2) + ', ' + position.lng.toFixed(2);
    }

    renderPolyline(position1, position2, color, openPopup, distance, key) {
        const initMarker = ref => ref && openPopup && ref.leafletElement.openPopup();

        if (position1 && position2) {
            return (
                <Polyline key={key} ref={initMarker} color={color} positions={
                    [[position1.lat, position1.lng], [position2.lat, position2.lng]]}>
                    <Popup offset={[0, -1]} className="font-weight-bold">Distance: {distance}</Popup>
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

    maintainMapPosition() {
        this.setState({
            mapBounds: null,
            mapCenter: (this.mapRef.current) ? this.mapRef.current.leafletElement.getCenter() : MAP_CENTER_DEFAULT,
            zoomLevel: (this.mapRef.current) ? this.mapRef.current.leafletElement.getZoom() : MAP_DEFAULT_ZOOM
        });
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

    async processFindRequestAddToTrip(placeData) {
        const newTrip = this.state.trip.addPlace(placeData);
        await newTrip.updateDistance();
        this.setState({trip: newTrip});
    }

    processFindRequestViewLocation(selectPlace) {
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
    const disabledText = disabled ? " (disabled)" : "";
    const ICON_COLOR = toggledOn ? undefined : blueGrey[200];
    return (
        <Control position={mapPosition}>
            <Tooltip title={tooltipText + disabledText} placement={tooltipPlacement} TransitionComponent={Zoom} arrow>
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
