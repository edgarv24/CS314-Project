import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import FindModal from '../src/components/Atlas/Modals/FindModal';
import {test, beforeEach} from "@jest/globals";
import {ListItem} from "@material-ui/core";
import Atlas from "../src/components/Atlas/Atlas";
import {ModalHeader} from "reactstrap";
import {PROTOCOL_VERSION} from "../src/utils/constants";

let wrapper;
let isOpen;

const toggleOpen = () => isOpen = !isOpen;

beforeEach(() => {
    isOpen = true;
    wrapper = shallow(<FindModal isOpen={isOpen} toggleOpen={toggleOpen}/>)
});

test("Testing FindModal's Initial State", () => {
    let actualPlaces = wrapper.state().places;
    let expectedPlaces = [];

    let actualInputText = wrapper.state().inputText;
    let expectedInputText = "";

    let actualSelectedPlace = wrapper.state().selectedPlace;
    let expectedSelectedPlace = null;

    expect(actualPlaces).toEqual(expectedPlaces);
    expect(actualInputText).toEqual(expectedInputText);
    expect(actualSelectedPlace).toEqual(expectedSelectedPlace);
});

test("Testing input box", () => {
    let input = wrapper.find("Input");
    let event = {target: {value: "Denver"}};

    input.simulate("change", event);

    let actualInputText = wrapper.state().inputText;
    let expectedInputText = 'Denver';

    expect(actualInputText).toEqual(expectedInputText);
});


test("Testing input list size after find requests", () => {
    let firstResponse = '{"data": {"requestType": "find", "requestVersion": 3, '+
        '                "match": "place", "found": 3, "places": [{"name": "Place1", "latitude": "90", "longitude": "100"}]}}';
    wrapper.setState({inputText: "place", selectedPlace: {"name": "place1", "latitude": "100", "longitude": "100"}})

    wrapper.instance().processFindResponse(JSON.parse(firstResponse));
    wrapper.update();
    expect(wrapper.state().places.length).toEqual(1);
    let secondResponse = '{"data": {"requestType": "find", "requestVersion": 3, ' +
        '                  "match": "place", "found": 3, "places": [{"name": "Place1", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place2", "latitude": "90", '+
        '                  "longitude": "100"},{"name": "Place3", "latitude": "90", "longitude": "100"}]}}';
    wrapper.instance().processFindResponse(JSON.parse(secondResponse));
    wrapper.update();
    expect(wrapper.state().places.length).toEqual(3);
});

test("Test bad response", () => {
    const response = {'match': 'This will not pass the schema.'};
    wrapper.setState({places: [{'name': 'Test', 'latitude': '10', 'longitude': '20'}]})
    expect(wrapper.state().places.length).toEqual(1);
    wrapper.instance().processFindResponse(response);
    expect(wrapper.state().places.length).toEqual(0);
    expect(wrapper.state().found).toEqual(0);
    expect(wrapper.state().selectedPlace).toEqual(null);
});

test("Testing listItem", () => {
    wrapper.setState({places: [
            {"name": "Airport 1", "latitude": "90", "longitude": "100"},
            {"name": "Airport 2", "latitude": "90", "longitude": "100"},
            {"name": "Airport 3", "latitude": "90", "longitude": "100"}]
    });

    const listItems = wrapper.instance().renderListItems();
    expect(listItems[0].key).toEqual('Airport 1-0');
    expect(listItems[1].key).toEqual('Airport 2-1');
    expect(listItems[2].key).toEqual('Airport 3-2');
});

test("Testing listItem onClick", () => {
    wrapper.setState({listToggle: true, places: [
            {"name": "Airport 1", "latitude": "90", "longitude": "100"},
            {"name": "Airport 2", "latitude": "90", "longitude": "100"},
            {"name": "Airport 3", "latitude": "90", "longitude": "100"}]
    });
    expect(wrapper.state().listToggle).toEqual(true);
    expect(wrapper.state().places.length).toEqual(3);

    wrapper.update();

    let listItems = wrapper.find(ListItem);
    expect(listItems.length).toEqual(3);

    listItems.at(0).simulate('click');
    expect(wrapper.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 1"})

    listItems.at(1).simulate('click');
    expect(wrapper.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 2"})

    listItems.at(2).simulate('click');
    expect(wrapper.state().selectedPlace).toEqual({"latitude": "90", "longitude": "100", "name": "Airport 3"})
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

test("Test Add to Trip button", () => {
    const addButton = wrapper.find('#add-to-trip-button');

    expect(isOpen).toBe(true);
    addButton.simulate('click');
    expect(isOpen).toBe(false);
});

test("has a working close button", () => {
    const closeButton = wrapper.find('#close-find-modal');

    expect(isOpen).toBe(true);
    closeButton.simulate('click');
    expect(isOpen).toBe(false);
});

test('toggles isOpen correctly', () => {
    const modal = wrapper.find('#find-modal');
    expect(modal).toBeDefined();

    expect(isOpen).toBe(true);
    modal.props()['toggle']();
    expect(isOpen).toBe(false);

    const header = wrapper.find(ModalHeader);
    expect(header).toBeDefined();
    expect(header.find('span').props()['children']).toEqual('Find Places');

    expect(isOpen).toBe(false);
    header.props().toggle();
    expect(isOpen).toBe(true);
});

test('clearing input box resets data', () => {
    wrapper.setState({places: [{'name': 'place 1', 'latitude': '10', 'longitude': '20'}]})
    expect(wrapper.state().places.length).toEqual(1);
    wrapper.instance().onInputChange('');
    expect(wrapper.state().places.length).toEqual(0);
    expect(wrapper.state().inputText).toEqual('');
});

test('onInputChange with valid newValue', () => {
    expect(wrapper.state().inputText).toEqual('');
    wrapper.instance().onInputChange('Denver');
    expect(wrapper.state().inputText).toEqual('Denver');
});

test('JSON body constructed correctly', () => {
    const requestBody = wrapper.instance().constructRequestBody('Denver');
    expect(requestBody.match).toEqual('Denver');
    expect(requestBody.requestVersion).toEqual(PROTOCOL_VERSION);
    expect(requestBody.requestType).toEqual('find');
});

test('valid server response should modify state', () => {
    mockFindResponse();

    wrapper.instance().requestFindFromServer('Denver');
    expect(wrapper.state().places.length).toEqual(0);
});

function mockFindResponse() {
    fetch.mockResponse(JSON.stringify(
        {
            requestType: "find",
            requestVersion: PROTOCOL_VERSION,
            match: "Denver",
            found: 3,
            limit: 1,
            places: [
                {"name": "Denver", "latitude": "90", "longitude": "100"}
            ]
        })
    );
}