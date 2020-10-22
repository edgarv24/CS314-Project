import './jestConfig/enzyme.config.js';

import React from 'react';
import {mount, shallow} from 'enzyme';


import FindModal from '../src/components/Atlas/FindModal';
import {test} from "@jest/globals";
import {ListItem} from "@material-ui/core";

test("Testing FindModal's Initial State", testInitialFindModalState);
function testInitialFindModalState() {
    const findModal = shallow(<FindModal/>);

    let actualPlaces = findModal.state().places;
    let expectedPlaces = null;

    let actualInputText = findModal.state().inputText;
    let expectedInputText = null;

    let actualListToggle = findModal.state().listToggle;
    let expectedListToggle = false;

    let actualButtonToggle = findModal.state().buttonToggle;
    let expectedButtonToggle = false;

    let actualSelectedPlace = findModal.state().selectedPlace;
    let expectedSelectedPlace = null;

    expect(actualPlaces).toEqual(expectedPlaces);
    expect(actualInputText).toEqual(expectedInputText);
    expect(actualListToggle).toEqual(expectedListToggle);
    expect(actualButtonToggle).toEqual(expectedButtonToggle);
    expect(actualSelectedPlace).toEqual(expectedSelectedPlace);
}

test("Testing input box", testInputBox);
function testInputBox() {
    const findModal = shallow(<FindModal/>);
    let input = findModal.find("Input");
    let event = {target: {value: "Denver"}};

    input.simulate("change", event);

    let actualInputText = findModal.state().inputText;
    let expectedInputText = 'Denver';

    expect(actualInputText).toEqual(expectedInputText);
}

test("Testing input list size after find requests", testListSize);
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

test("Testing listItem", () => {
    const findModal = shallow(<FindModal/>);
    findModal.setState({listToggle: true, places: [
            {"name": "Airport 1", "latitude": "90", "longitude": "100"},
            {"name": "Airport 2", "latitude": "90", "longitude": "100"},
            {"name": "Airport 3", "latitude": "90", "longitude": "100"}]
    });
    let listItems = findModal.instance().renderList();
    expect(listItems.type).toBe(ListItem.type);
    expect(listItems[0].key).toEqual('Airport 1');
    expect(listItems[1].key).toEqual('Airport 2');
    expect(listItems[2].key).toEqual('Airport 3');
});
