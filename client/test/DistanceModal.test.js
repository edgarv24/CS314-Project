import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import DistanceModal from '../src/components/Atlas/DistanceModal';

function testInputBoxes() {
    const distModal = shallow(<DistanceModal/>);
    expect(distModal.find('Input').length).toEqual(2);
}

test("Test that both input boxes rendered", testInputBoxes);

function testInputBoxValues() {
    const distModal = shallow(<DistanceModal
        input1={"90, 90"}
        input2={"80, 80"}
        />);
    expect(distModal.find('Input').at(0).props().value).toEqual("90, 90");
    expect(distModal.find('Input').at(1).props().value).toEqual("80, 80");
}

test("Test text in input boxes", testInputBoxValues);

function testCancelButton() {
    const distModal = shallow(<DistanceModal
        input1={"90, 90"}
        input2={"80, 80"}
        toggleOpen={() => {}}
    />);
    expect(distModal.find('Button').length).toEqual(2);
    distModal.find('Button').at(0).simulate('click');
    expect(distModal.state().inputValues).toEqual([null, null]);
}

test("Testing that cancel button sets input values to null", testCancelButton);

function testDistance() {
    const distModal = shallow(<DistanceModal/>);
    let response = '{"data": {"requestType": "distance", "requestVersion": 3, ' +
        '                "place1": {"latitude": "90", "longitude": "100"}, ' +
        '                "place2": {"latitude": "90", "longitude": "100"}, ' +
        '                 "earthRadius": 6371.0, "distance": 1989}}';
    distModal.instance().processDistanceResponse(JSON.parse(response));
    expect(distModal.state().calculatedDistance).toEqual(1989);
}

test("Test that calculatedDistance is updated correctly", testDistance);

function testUpdateAndConvert() {
    const distModal = shallow(<DistanceModal/>);

    let denverCoords = "39.744137, -104.950050";
    let focoCoords = "40.5853, -105.0844";
    let invalidCoords = "lat, lng";

    distModal.instance().updateInputValueAndAttemptConvert(0, denverCoords);
    distModal.instance().updateInputValueAndAttemptConvert(1, focoCoords);

    let actualInputValues1 = distModal.state().inputValues[0];
    let actualInputValues2 = distModal.state().inputValues[1];
    let actualCoordPairs1 = distModal.state().coordinatePairs[0];
    let expectedCoordPairs1 = {lat: 39.744137, lng: -104.950050};
    let actualCoordPairs2 = distModal.state().coordinatePairs[1];
    let expectedCoordPairs2 = {lat: 40.5853, lng: -105.0844};

    expect(actualInputValues1).toEqual(denverCoords);
    expect(actualInputValues2).toEqual(focoCoords);
    expect(actualCoordPairs1).toEqual(expectedCoordPairs1);
    expect(actualCoordPairs2).toEqual(expectedCoordPairs2);

    distModal.instance().updateInputValueAndAttemptConvert(1, invalidCoords);
    let actualInvalidValues = distModal.state().inputValues[1];
    let actualInvalidCoords = distModal.state().coordinatePairs[1];

    expect(actualInputValues1).toEqual(denverCoords);
    expect(actualCoordPairs1).toEqual(expectedCoordPairs1);
    expect(actualInvalidValues).toEqual(invalidCoords);
    expect(actualInvalidCoords).toEqual(null);
}

test("Test updateInputValueAndAttemptConvert function", testUpdateAndConvert);
