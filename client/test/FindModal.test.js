import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';


import FindModal from '../src/components/Atlas/Modals/FindModal';
import {test} from "@jest/globals";
import {ListItem} from "@material-ui/core";
import Atlas from "../src/components/Atlas/Atlas";

test("Testing FindModal's Initial State", testInitialFindModalState);
function testInitialFindModalState() {
    const findModal = shallow(<FindModal/>);

    let actualPlaces = findModal.state().places;
    let expectedPlaces = [];

    let actualInputText = findModal.state().inputText;
    let expectedInputText = "";

    let actualSelectedPlace = findModal.state().selectedPlace;
    let expectedSelectedPlace = null;

    expect(actualPlaces).toEqual(expectedPlaces);
    expect(actualInputText).toEqual(expectedInputText);
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
        '                "match": "place", "found": 3, "places": [{"name": "Place1", "latitude": "90", "longitude": "100"}]}}';
    findModal.setState({inputText: "place", selectedPlace: {"name": "place1", "latitude": "100", "longitude": "100"}})

    findModal.instance().processFindResponse(JSON.parse(firstResponse));
    findModal.update();
    expect(findModal.state().places.length).toEqual(1);
    let secondResponse = '{"data": {"requestType": "find", "requestVersion": 3, ' +
        '                  "match": "place", "found": 3, "places": [{"name": "Place1", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place2", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place3", "latitude": "90", "longitude": "100"}]}}';
    findModal.instance().processFindResponse(JSON.parse(secondResponse));
    findModal.update();
    expect(findModal.state().places.length).toEqual(3);
}

test("Testing listItem", () => {
    const findModal = shallow(<FindModal/>);
    findModal.setState({places: [
            {"name": "Airport 1", "latitude": "90", "longitude": "100"},
            {"name": "Airport 2", "latitude": "90", "longitude": "100"},
            {"name": "Airport 3", "latitude": "90", "longitude": "100"}]
    });

    const listItems = findModal.instance().renderListItems();
    expect(listItems[0].key).toEqual('Airport 1-0');
    expect(listItems[1].key).toEqual('Airport 2-1');
    expect(listItems[2].key).toEqual('Airport 3-2');
});

test("Testing listItem onClick", () => {
    const findModal = shallow(<FindModal/>);
    findModal.setState({listToggle: true, places: [
            {"name": "Airport 1", "latitude": "90", "longitude": "100"},
            {"name": "Airport 2", "latitude": "90", "longitude": "100"},
            {"name": "Airport 3", "latitude": "90", "longitude": "100"}]
    });
    expect(findModal.state().listToggle).toEqual(true);
    expect(findModal.state().places.length).toEqual(3);

    findModal.update();

    let listItems = findModal.find(ListItem);
    expect(listItems.length).toEqual(3);

    listItems.at(0).simulate('click');
    expect(findModal.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 1"})

    listItems.at(1).simulate('click');
    expect(findModal.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 2"})

    listItems.at(2).simulate('click');
    expect(findModal.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 3"})
});


test("Testing Locate button", () => {
    const atlas = shallow(<Atlas />);
    const findModal = shallow(<FindModal
        isOpen={true}
        toggleOpen={() => undefined}
        processFindRequestViewLocation={atlas.instance().processFindRequestViewLocation}/>);

    findModal.setState({selectedPlace: {"latitude": "90", "longitude": "100", "name": "Airport 1"}});
    findModal.update();

    expect(findModal.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 1"});

    let locateButton = findModal.find("#locate-button");
    expect(locateButton.length).toEqual(1);

    let testPos = {lat: 50, lng: 60};
    atlas.setState({
        markerPosition: {lat: 20, lng: 20},
        secondMarkerPosition: testPos,
        mapCenter: testPos.latlng
    });
    atlas.update();

    expect(atlas.state().markerPosition).toEqual({lat: 20, lng: 20});
    expect(atlas.state().secondMarkerPosition).toEqual(testPos);

    const selectedPlace = findModal.state().selectedPlace;
    locateButton.simulate('click');
    atlas.update();

    let expectedPosition = {lat: parseInt(selectedPlace.latitude), lng: parseInt(selectedPlace.longitude)};

    expect(atlas.state().secondMarkerPosition).toEqual(expectedPosition);
});