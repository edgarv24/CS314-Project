import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';
import axios from 'axios';

import FindModal from '../src/components/Atlas/FindModal';
import {jest} from "@jest/globals";

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

    let actualSelectedPlace = findModal.state().selectedPlace;
    let expectedSelectedPlace = null;

    expect(actualPlaces).toEqual(expectedPlaces);
    expect(actualInputText).toEqual(expectedInputText);
    expect(actualListToggle).toEqual(expectedListToggle);
    expect(actualLocateToggle).toEqual(expectedLocateToggle);
    expect(actualSelectedPlace).toEqual(expectedSelectedPlace);
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


