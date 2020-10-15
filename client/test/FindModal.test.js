import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import FindModal from '../src/components/Atlas/FindModal';
import Atlas from "../src/components/Atlas/Atlas";

const startProperties = {
    createSnackBar: jest.fn()
};


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
    const event = {target: {name: "value", value: "Denver"}};
    const input = findModal.find('input');
    input.simulate('change', event);
    expect(findModal.state().inputText).toEqual('Denver');
}

test("Testing input box", testInputBox);