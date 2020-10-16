import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';


import FindModal from '../src/components/Atlas/FindModal';


function testInitialFindModalState() {
    const findModal = shallow(<FindModal/>);

    let actualPlaces = findModal.state().places;
    let expectedPlaces = null;

    let actualInputText = findModal.state().inputText;
    let expectedInputText = null;

    let actualListToggle = findModal.state().listToggle;
    let expectedListToggle = false;

    let actualLocateToggle = findModal.state().locateToggle;
    let expectedLocateToggle = false;

    expect(actualPlaces).toEqual(expectedPlaces);
    expect(actualInputText).toEqual(expectedInputText);
    expect(actualListToggle).toEqual(expectedListToggle);
    expect(actualLocateToggle).toEqual(expectedLocateToggle);
}

test("Testing FindModal's Initial State", testInitialFindModalState);

function testInputBox() {
    const findModal = shallow(<FindModal/>);
    let input = findModal.find("Input");
    let event = {target: {value: "Denver"}};

    input.simulate("change", event);

    let actualInputText = findModal.state().inputText;
    let expectedInputText = 'Denver';

    expect(actualInputText).toEqual(expectedInputText);
}

test("Testing input box", testInputBox);

function testListSize() {
    const findModal = shallow(<FindModal/>);
    let firstResponse = '{"data": {"requestType": "find", "requestVersion": 3, '+
        '                "found": 3, "places": [{"name": "Place1", "latitude": "90", "longitude": "100"}]}}';
    findModal.instance().processFindResponse(JSON.parse(firstResponse));
    findModal.update();
    expect(findModal.state().places.length).toEqual(1);
    let secondResponse = '{"data": {"requestType": "find", "requestVersion": 3, ' +
        '                  "found": 3, "places": [{"name": "Place1", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place2", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place3", "latitude": "90", "longitude": "100"}]}}';
    findModal.instance().processFindResponse(JSON.parse(secondResponse));
    findModal.update();
    expect(findModal.state().places.length).toEqual(3);
}

test("Testing input list size after find request", testListSize);
