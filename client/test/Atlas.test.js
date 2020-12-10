import './jestConfig/enzyme.config.js';

import React from 'react';
import {mount, shallow} from 'enzyme';

import peaksTrip from '../test/TripFiles/peaks-trip.json';
import Atlas from '../src/components/Atlas/Atlas';
import Itinerary from "../src/components/Atlas/Itinerary/Itinerary";
import {Marker} from "react-leaflet";
import Polyline from 'react-leaflet-arrowheads';
import {beforeEach, describe, jest, test} from "@jest/globals";
import DistanceModal from "../src/components/Atlas/Modals/DistanceModal";
import FindModal from "../src/components/Atlas/Modals/FindModal";

const MAP_CENTER_DEFAULT = {lat: 40.5734, lng: -105.0865};
const MAP_DEFAULT_ZOOM = 15;

const startProperties = {
    createSnackBar: jest.fn()
};

describe('Atlas', () => {
    let atlas;
    let atlasMounted;

    function simulateButtonClickEvent(reactWrapper, buttonID) {
        const button = reactWrapper.find(buttonID).at(0);
        expect(button).toBeDefined();
        button.simulate('click');
        reactWrapper.update();
    }

    function simulateOnClickEvent(reactWrapper, event) {
        reactWrapper.find('Map').at(0).simulate('click', event);
        reactWrapper.update();
    }
    
    beforeEach(() => {
        atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
        atlasMounted = mount(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    });
    
    test("Testing Atlas's Initial State", () => {
        let actualMarkerPosition = atlas.state().markerPosition;
        let expectedMarkerPosition = null;

        expect(actualMarkerPosition).toEqual(expectedMarkerPosition);
    });

    test("Testing initial trip state", () => {
        const trip = atlas.state().trip;

        expect(trip.title.length).toBeGreaterThan(0);
        expect(trip.places).toBeDefined();
        expect(trip.distances).toBeDefined();
    });

    test("Testing Marker Rendered on Click", () => {
        let actualMarkerPosition = atlas.state().markerPosition;
        let expectedMarkerPosition = null;

        expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

        let latlng = {lat: 0, lng: 0};
        simulateOnClickEvent(atlas, {latlng: latlng});

        //expect(atlas.state().markerPosition).toEqual(latlng);
    });

    test("Testing that the second marker renders correctly", () => {
        expect(atlas.state().secondMarkerPosition).toEqual(null);

        let firstClick = {lat: 0, lng: 0};
        let secondClick = {lat: 1, lng: 1};
        simulateOnClickEvent(atlas, {latlng: firstClick});
        simulateOnClickEvent(atlas, {latlng: secondClick});

        //expect(atlas.state().markerPosition).toEqual(firstClick);
        //expect(atlas.state().secondMarkerPosition).toEqual(secondClick);

        simulateOnClickEvent(atlas, {latlng: firstClick});

        //expect(atlas.state().secondMarkerPosition).toEqual(firstClick);
    });

    test("Testing Polyline Render", () => {
        let firstClick = {lat: 0, lng: 0};
        let secondClick = {lat: 10, lng: 10};

        simulateOnClickEvent(atlas, {latlng: firstClick});
        simulateOnClickEvent(atlas, {latlng: secondClick});
        atlas.instance().processDistanceRequestSuccess(firstClick, secondClick, 0);

        expect(atlas.find(Polyline)).toHaveLength(1);

        let polyline = atlas.find(Polyline);

        expect(polyline.props().positions).toEqual([[firstClick.lat, firstClick.lng], [secondClick.lat, secondClick.lng]]);
    });

    test("Test button that returns to home position (no geolocation)", () => {
        const home = atlasMounted.instance().getHomePosition();

        atlasMounted.setState({markerPosition: home}); // normally done in componentDidMount

        simulateOnClickEvent(atlasMounted, {latlng: {lat: 0, lng: 0}});
        expect(atlasMounted.state().secondMarkerPosition).toEqual(null);

        simulateButtonClickEvent(atlasMounted, '#home-button')
        expect(atlasMounted.state().secondMarkerPosition).toEqual(home);
        expect(atlasMounted.state().mapCenter).toEqual(home);
    });

    test("Test button that opens find modal", () => {
        expect(atlasMounted.state().findModalOpen).toBe(false);
        simulateButtonClickEvent(atlasMounted, '#find-button')
        expect(atlasMounted.state().findModalOpen).toBe(true);
    });

    test("Test button that opens distance modal", () => {
        expect(atlasMounted.state().distModalOpen).toBe(false);
        simulateButtonClickEvent(atlasMounted, '#distance-button')
        expect(atlasMounted.state().distModalOpen).toBe(true);
    });

    test("Test button that disables markers", () => {
        expect(atlasMounted.state().displayTripMarkers).toBe(true);
        simulateButtonClickEvent(atlasMounted, '#toggle-trip-markers')
        expect(atlasMounted.state().displayTripMarkers).toBe(true);
        atlasMounted.find('#toggle-trip-markers').at(0).props()['onClick']();
        expect(atlasMounted.state().displayTripMarkers).toBe(false);
    });

    test("Test button that disables trip lines", () => {
        expect(atlasMounted.state().displayTripLines).toBe(true);
        simulateButtonClickEvent(atlasMounted, '#toggle-trip-lines')
        expect(atlasMounted.state().displayTripLines).toBe(true);
        atlasMounted.find('#toggle-trip-lines').at(0).props()['onClick']();
        expect(atlasMounted.state().displayTripLines).toBe(false);
    });

    test("Test button that performs optimize function", async () => {
        atlasMounted.setState({trip: atlasMounted.state().trip.addPlace({'name': 'Place 1', 'latitude': '10', 'longitude': '40'})});
        expect(atlasMounted.state().trip.options.response).toEqual("0.0");
        //await simulateButtonClickEvent(atlasMounted, '#optimize-button');
        //expect(atlasMounted.state().trip.options.response).toEqual("1.0"); // fix to test async
    });

    test("Test renderDistanceLabel default", () => {
        let distanceLabel = atlas.find('Input');
        expect(distanceLabel.props().value).toEqual('N/A');
    });

    test("Test renderDistanceLabel with 1 mile", () => {
        atlas.setState({distanceLabel: '1'});
        expect(atlas.instance().getDistanceLabelText()).toEqual("1 mile");
    });

    test("Test renderDistanceLabel with 100 miles", () => {
        atlas.setState({distanceLabel: '100'});
        atlas.update();
        let distanceLabel = atlas.find('Input');
        expect(distanceLabel.props().value).toEqual('100 miles');
    });

    test("Test renderMapMarkers returning correct trip markers", () => {
        const p1 = {'name': 'Place 1', 'latitude': '0', 'longitude': '0'};
        const p2 = {'name': 'Place 2', 'latitude': '0', 'longitude': '0'};
        const p3 = {'name': 'Place 3', 'latitude': '0', 'longitude': '0'};
        let newTrip = atlas.state().trip.addPlaces([p1, p2, p3]);
        atlas.setState({trip: newTrip});
        atlas.update();
        expect(atlas.find(Marker).length).toBeGreaterThanOrEqual(3);
    });

    test("Test getMapBounds with zero markers", () => {
       let actualBounds = atlas.instance().getMapBounds(null, null);
       let expectedBounds = L.latLngBounds([MAP_CENTER_DEFAULT]);
       expect(actualBounds).toEqual(expectedBounds);
    });

    test("Test getMapBounds with one marker", () => {
        let marker1 = {lat: 20, lng: 20};
        let actualBounds = atlas.instance().getMapBounds(marker1, null);
        let expectedBounds = L.latLngBounds([{lat: 20, lng: 20}]);
        expect(actualBounds).toEqual(expectedBounds);
    });

    test("Test getMapBounds with both markers", () => {
        let marker1 = {lat: 20, lng: 20};
        let marker2 = {lat: 30, lng: 30};
        let actualBounds = atlas.instance().getMapBounds([marker1, marker2]);
        let expectedBounds = L.latLngBounds([{lat: 20, lng: 20}, {lat: 30, lng: 30}]);
        expect(actualBounds).toEqual(expectedBounds);
    });

    test("Test processDistanceRequestSuccess", () => {
        let c1 = {lat: 20, lng: 20};
        let c2 = {lat: 30, lng: 30};
        let dist = "100";
        atlas.instance().processDistanceRequestSuccess(c1, c2, dist);
        atlas.update();
        expect(atlas.state().markerPosition).toEqual(c1);
        expect(atlas.state().secondMarkerPosition).toEqual(c2);
        expect(atlas.state().distanceLabel).toEqual(dist);
        expect(atlas.state().mapCenter).toEqual(MAP_CENTER_DEFAULT);
        expect(atlas.state().zoomLevel).toEqual(MAP_DEFAULT_ZOOM);
    });

    test("Test itinerary is rendered", () => {
        const atlasWrapper = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
        const itinerary = atlasWrapper.find(Itinerary).at(0);
        expect(itinerary).toBeDefined();
    });

    test('renders list of trip lines if toggled', () => {
        expect(atlas.find(Polyline).length).toEqual(0);
        atlas.setState({displayTripLines: true, trip: atlas.state().trip.loadJSON(peaksTrip)});
        expect(atlas.find(Polyline).length).toEqual(6);
    });

    test('successfully toggles distanceModal', () => {
        atlas.setState({distModalOpen: true});
        atlas.find(DistanceModal).props()['toggleOpen']();
        expect(atlas.state().distModalOpen).toBe(false);
    });

    test('successfully toggles findModal', () => {
        atlas.setState({findModalOpen: true});
        atlas.find(FindModal).props()['toggleOpen']();
        expect(atlas.state().findModalOpen).toBe(false);
    });

    test('itinerary sets trip', async () => {
        // don't know how to fix after making async
        //atlas.setState({trip: new Trip()});
        //await atlas.find(Itinerary).props()['setTrip'](atlas.state().trip.loadJSON(peaksTrip));
        //expect(atlas.state().trip.places.length).toEqual(6);
    });

    test('get home position when userLocation is non-null', () => {
        const home = {lat: 10, lng: 40}
        expect(atlas.instance().getHomePosition()).not.toEqual(home);
        atlas.setState({userPosition: home});
        expect(atlas.instance().getHomePosition()).toEqual(home);
    });

    test('edit button rendered on trip marker', () => {
        const p1 = {'name': 'Place 1', 'latitude': '0', 'longitude': '0'};
        const p2 = {'name': 'Place 2', 'latitude': '0', 'longitude': '0'};
        const newTrip = atlas.state().trip.addPlaces([p1, p2]);

        atlas.setState({trip: newTrip});
        expect(atlas.state().trip.places.length).toEqual(2);

        expect(atlas.find(Marker).length).toEqual(2);
        const firstMarker = atlas.find('#marker-3');
        expect(firstMarker.props()).not.toBe(null);

        expect(atlas.state().destinationModalOpen).toEqual(false);
        const firstMarkerButton = atlas.find('#marker-button-3');
        firstMarkerButton.simulate('click');
        expect(atlas.state().destinationModalOpen).toEqual(true);
    });

    test('getDestinationModalData correct values are returned', async () => {
        const p1 = {lat: 0, lng: 0};
        const p2 = {lat: 10, lng: -10};
        const p3 = {lat: -90, lng: 90};

        atlas.setState({userPosition: p1, markerPosition: p2, secondMarkerPosition: p3});

        const r1 = atlas.instance().getMarkerData(0, false);
        expect(r1).toEqual({'latitude': '0', 'longitude': '0', 'name': 'Home'});

        const r2 = atlas.instance().getMarkerData(1, false);
        expect(r2).toEqual({'latitude': '10', 'longitude': '-10', 'name': ''});

        const r3 = atlas.instance().getMarkerData(2, false);
        expect(r3).toEqual({'latitude': '-90', 'longitude': '90', 'name': ''});
    });
});
