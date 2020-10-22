import './jestConfig/enzyme.config.js';

import React from 'react';
import {mount, shallow} from 'enzyme';

import Atlas from '../src/components/Atlas/Atlas';
import Itinerary from "../src/components/Atlas/Itinerary";
import {Polyline} from "react-leaflet";
import {beforeEach, describe, jest, test} from "@jest/globals";

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

        expect(trip.title).toEqual("My Trip");
        expect(trip.places).toEqual([]);
        expect(trip.distances).toEqual([]);
    });

    test("Testing Marker Rendered on Click", () => {
        let actualMarkerPosition = atlas.state().markerPosition;
        let expectedMarkerPosition = null;

        expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

        let latlng = {lat: 0, lng: 0};
        simulateOnClickEvent(atlas, {latlng: latlng});

        expect(atlas.state().markerPosition).toEqual(latlng);
    });

    test("Testing that the second marker renders correctly", () => {
        expect(atlas.state().secondMarkerPosition).toEqual(null);

        let firstClick = {lat: 0, lng: 0};
        let secondClick = {lat: 1, lng: 1};
        simulateOnClickEvent(atlas, {latlng: firstClick});
        simulateOnClickEvent(atlas, {latlng: secondClick});

        expect(atlas.state().markerPosition).toEqual(firstClick);
        expect(atlas.state().secondMarkerPosition).toEqual(secondClick);

        simulateOnClickEvent(atlas, {latlng: firstClick});

        expect(atlas.state().secondMarkerPosition).toEqual(firstClick);
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
        expect(atlasMounted.state().findModalOpen).toBeFalsy();

        simulateButtonClickEvent(atlasMounted, '#find-button')
        expect(atlasMounted.state().findModalOpen).toBeTruthy();
    });

    test("Test button that opens distance modal", () => {
        expect(atlasMounted.state().distModalOpen).toBeFalsy();

        simulateButtonClickEvent(atlasMounted, '#distance-button')
        expect(atlasMounted.state().distModalOpen).toBeTruthy();
    });

    test("Test button that scrolls page down", () => {
        window.scrollTo = jest.fn();

        expect(window.scrollY).toEqual(0);

        simulateButtonClickEvent(atlasMounted, '#scroll-down-button')
        expect(window.scrollY).toEqual(document.body.offsetHeight);
    });

    test("Test renderDistanceLabel default", () => {
        let distanceLabel = atlas.find('Input');
        expect(distanceLabel.props().value).toEqual('N/A');
    });

    test("Test renderDistanceLabel with 1 mile", () => {
        atlas.setState({distanceLabel: '1'});
        atlas.update();
        let distanceLabel = atlas.find('Input');
        expect(distanceLabel.props().value).toEqual('1 miles');
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
        let newTrip = atlasMounted.state().trip.addPlaces([p1, p2, p3]);
        atlasMounted.setState({trip: newTrip});
        atlasMounted.update();
        expect(atlasMounted.find('Marker').length).toEqual(3);
    });

    test("Test getMapBounds with zero markers", () => {
       let actualBounds = atlas.instance().getMapBounds(null, null);
       let expectedBounds = new L.latLngBounds([MAP_CENTER_DEFAULT]);
       expect(actualBounds).toEqual(expectedBounds);
    });

    test("Test getMapBounds with one marker", () => {
        let marker1 = {lat: 20, lng: 20};
        let actualBounds = atlas.instance().getMapBounds(marker1, null);
        let expectedBounds = new L.latLngBounds([{lat: 20, lng: 20}]);
        expect(actualBounds).toEqual(expectedBounds);
    });

    test("Test getMapBounds with both markers", () => {
        let marker1 = {lat: 20, lng: 20};
        let marker2 = {lat: 30, lng: 30};
        let actualBounds = atlas.instance().getMapBounds([marker1, marker2]);
        let expectedBounds = new L.latLngBounds([{lat: 20, lng: 20}, {lat: 30, lng: 30}]);
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
});
