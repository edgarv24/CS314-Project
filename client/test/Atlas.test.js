import './jestConfig/enzyme.config.js';

import React from 'react';
import {mount, shallow} from 'enzyme';

import Atlas from '../src/components/Atlas/Atlas';
import {Polyline} from "react-leaflet";
import {jest, test} from "@jest/globals";


const startProperties = {
    createSnackBar: jest.fn()
};

test("Testing Atlas's Initial State", () => {
    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);
});

test("Testing Marker Rendered on Click", () => {
    const atlas = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    let actualMarkerPosition = atlas.state().markerPosition;
    let expectedMarkerPosition = null;

    expect(actualMarkerPosition).toEqual(expectedMarkerPosition);

    let latlng = {lat: 0, lng: 0};
    simulateOnClickEvent(atlas, {latlng: latlng});

    expect(atlas.state().markerPosition).toEqual(latlng);
});

function simulateOnClickEvent(reactWrapper, event) {
    reactWrapper.find('Map').at(0).simulate('click', event);
    reactWrapper.update();
}

test("Testing that the second marker renders correctly", () => {
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
});

test("Testing Polyline Render", () => {
    const atlasWrapper = shallow(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    let firstClick = {lat: 0, lng: 0};
    let secondClick = {lat: 10, lng: 10};

    simulateOnClickEvent(atlasWrapper, {latlng: firstClick});
    simulateOnClickEvent(atlasWrapper, {latlng: secondClick});
    atlasWrapper.instance().processDistanceRequestSuccess(firstClick, secondClick, 0);

    expect(atlasWrapper.find(Polyline)).toHaveLength(1);

    let polyline = atlasWrapper.find(Polyline);

    expect(polyline.props().positions).toEqual([[firstClick.lat, firstClick.lng], [secondClick.lat, secondClick.lng]]);
});

function simulateButtonClickEvent(atlasWrapper, buttonID) {
    const button = atlasWrapper.find(buttonID).at(0);
    expect(button).toBeDefined();
    button.simulate('click');
    atlasWrapper.update();
}

test("Test button that returns to home position (no geolocation)", () => {
    const atlasWrapper = mount(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    const home = atlasWrapper.instance().getHomePosition();

    atlasWrapper.setState({markerPosition: home}); // normally done in componentDidMount

    simulateOnClickEvent(atlasWrapper, {latlng: {lat: 0, lng: 0}});
    expect(atlasWrapper.state().secondMarkerPosition).toEqual(null);

    simulateButtonClickEvent(atlasWrapper, '#home-button')
    expect(atlasWrapper.state().secondMarkerPosition).toEqual(home);
    expect(atlasWrapper.state().mapCenter).toEqual(home);
});

test("Test button that opens find modal", () => {
    const atlasWrapper = mount(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    expect(atlasWrapper.state().findModalOpen).toBeFalsy();

    simulateButtonClickEvent(atlasWrapper, '#find-button')
    expect(atlasWrapper.state().findModalOpen).toBeTruthy();
});

test("Test button that opens distance modal", () => {
    const atlasWrapper = mount(<Atlas createSnackBar={startProperties.createSnackBar}/>);

    expect(atlasWrapper.state().distModalOpen).toBeFalsy();

    simulateButtonClickEvent(atlasWrapper, '#distance-button')
    expect(atlasWrapper.state().distModalOpen).toBeTruthy();
});

test("Test button that scrolls page down", () => {
    const atlasWrapper = mount(<Atlas createSnackBar={startProperties.createSnackBar}/>);
    window.scrollTo = jest.fn();

    expect(window.scrollY).toEqual(0);

    simulateButtonClickEvent(atlasWrapper, '#scroll-down-button')
    expect(window.scrollY).toEqual(document.body.offsetHeight);
});