import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import Atlas from '../src/components/Atlas/Atlas';

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


