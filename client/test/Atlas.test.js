import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import Atlas from '../src/components/Atlas/Atlas';
import {Polyline} from "react-leaflet";

const startProperties = {
    createSnackBar: jest.fn()
};

function testInitialAtlasState() {
    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);
}

test("Testing Atlas's Initial State", testInitialAtlasState);

function testMarkerIsRenderedOnClick() {
    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

    let latlng = {lat: 0, lng: 0};
    simulateOnClickEvent(atlas, {latlng: latlng});

    expect(atlas.state().markerPosition).toEqual(latlng);
    // expect(atlas.find('Marker')).toEqual(1); ??
}

test("Testing Marker Rendered on Click", testMarkerIsRenderedOnClick);

function simulateOnClickEvent(reactWrapper, event) {
    reactWrapper.find('Map').at(0).simulate('click', event);
    reactWrapper.update();
}

function testWhereAmIButtonNoGeolocation() {
    const atlasWrapper = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    const atlas = atlasWrapper.instance();

    let actualMarkerPosition = atlas.state.markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

    let latlng = {lat: 0, lng: 0};
    simulateOnClickEvent(atlasWrapper, {latlng: latlng});
    atlas.setMapToHome();

    let home = atlas.getHomePosition();
    let homeLatLong = {lat: home[0], lng: home[1]};

    expect(atlas.state.markerPosition).toEqual(homeLatLong);
    expect(atlas.state.mapCenter).toEqual(home);
}

test("Testing Where am I Button (no geolocation)", testWhereAmIButtonNoGeolocation);

function testSecondMarkerRender() {
    const atlasWrapper = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    expect(atlasWrapper.state().secondMarkerPosition).toEqual(null);

    let firstClick = {lat: 0, lng: 0};
    let secondClick = {lat: 1, lng: 1};
    simulateOnClickEvent(atlasWrapper, {latlng: firstClick});
    simulateOnClickEvent(atlasWrapper, {latlng: secondClick});

    expect(atlasWrapper.state().markerPosition).toEqual(firstClick);
    expect(atlasWrapper.state().secondMarkerPosition).toEqual(secondClick);

    simulateOnClickEvent(atlasWrapper, {latlng: firstClick});

    expect(atlasWrapper.state().secondMarkerPosition).toEqual(firstClick);
}

test("Testing that the second marker renders correctly", testSecondMarkerRender);

function testPolyLineRender() {
    const atlasWrapper = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    let firstClick = {lat: 0, lng: 0};
    let secondClick = {lat: 10, lng: 10};

    simulateOnClickEvent(atlasWrapper, {latlng: firstClick});
    simulateOnClickEvent(atlasWrapper, {latlng: secondClick});

    expect(atlasWrapper.containsMatchingElement(<Polyline />)).toEqual(true);

    let polyline = atlasWrapper.find(Polyline);

    expect(polyline.props().positions).toEqual([[firstClick.lat, firstClick.lng], [secondClick.lat, secondClick.lng]]);
}

test("Testing Polyline Render", testPolyLineRender);
