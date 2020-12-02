import './jestConfig/enzyme.config.js';
import {shallow} from 'enzyme';
import {beforeEach, describe, it} from "@jest/globals";

import React from 'react';
import {ModalHeader} from "reactstrap";
import DistanceModal from '../src/components/Atlas/Modals/DistanceModal';
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";

const TRIP = new Trip().loadJSON(peaksTrip);

describe('Distance Modal', () => {
    let wrapper;
    let isOpen;
    let calculatedDistance;

    const toggleOpen = () => isOpen = !isOpen;
    const processDistanceRequestSuccess = (c1, c2, distance) => calculatedDistance = distance;

    beforeEach(() => {
        isOpen = true;
        calculatedDistance = null;
        wrapper = shallow(
            <DistanceModal
                isOpen={isOpen}
                toggleOpen={toggleOpen}
                processDistanceRequestSuccess={processDistanceRequestSuccess}
                trip={TRIP}
                input1={"90, 90"}
                input2={"80, 80"}
            />);
    });

    it("renders both input boxes", () => {
        expect(wrapper.find('Input').length).toEqual(2);
    });

    it("auto-fills inputs on open", () => {
        expect(wrapper.find('Input').at(0).props().value).toEqual("90, 90");
        expect(wrapper.find('Input').at(1).props().value).toEqual("80, 80");
    });

    it("clears input boxes on cancel", () => {
        const cancelButton = wrapper.find('#close-distance-modal');
        expect(cancelButton).toBeDefined();
        cancelButton.simulate('click');
        expect(wrapper.state().inputValues).toEqual([null, null]);
    });

    it("updates calculatedDistance correctly", () => {
        let response = '{"data": {"requestType": "distance", "requestVersion": 3, ' +
            '                "place1": {"latitude": "90", "longitude": "100"}, ' +
            '                "place2": {"latitude": "90", "longitude": "100"}, ' +
            '                 "earthRadius": 6371.0, "distance": 1989}}';
        wrapper.instance().processDistanceResponse(JSON.parse(response));
        expect(wrapper.state().calculatedDistance).toEqual(1989);
    });

    it("Test updateInputValueAndAttemptConvert function", () => {
        let denverCoords = "39.744137, -104.950050";
        let focoCoords = "40.5853, -105.0844";
        let invalidCoords = "lat, lng";

        wrapper.instance().updateInputValueAndAttemptConvert(0, denverCoords);
        wrapper.instance().updateInputValueAndAttemptConvert(1, focoCoords);

        let actualInputValues1 = wrapper.state().inputValues[0];
        let actualInputValues2 = wrapper.state().inputValues[1];
        let actualCoordPairs1 = wrapper.state().coordinatePairs[0];
        let expectedCoordPairs1 = {lat: 39.744137, lng: -104.950050};
        let actualCoordPairs2 = wrapper.state().coordinatePairs[1];
        let expectedCoordPairs2 = {lat: 40.5853, lng: -105.0844};

        expect(actualInputValues1).toEqual(denverCoords);
        expect(actualInputValues2).toEqual(focoCoords);
        expect(actualCoordPairs1).toEqual(expectedCoordPairs1);
        expect(actualCoordPairs2).toEqual(expectedCoordPairs2);

        wrapper.instance().updateInputValueAndAttemptConvert(1, invalidCoords);
        let actualInvalidValues = wrapper.state().inputValues[1];
        let actualInvalidCoords = wrapper.state().coordinatePairs[1];

        expect(actualInputValues1).toEqual(denverCoords);
        expect(actualCoordPairs1).toEqual(expectedCoordPairs1);
        expect(actualInvalidValues).toEqual(invalidCoords);
        expect(actualInvalidCoords).toEqual(null);
    });

    it('updates inputValues on input box change', () => {
        const input = wrapper.find('#coordinate-input-0');
        expect(input).toBeDefined();
        const input2 = wrapper.find('#coordinate-input-1');
        expect(input2).toBeDefined();

        wrapper.setState({inputValues: [null, null]})
        input.simulate('change', {target: { value: '10, 20' }});
        expect(wrapper.state().inputValues).toEqual(['10, 20', null]);

        input2.simulate('change', {target: { value: '30, 40' }});
        expect(wrapper.state().inputValues).toEqual(['10, 20', '30, 40']);
    });

    it('has a functioning submit button', () => {
        const submitButton = wrapper.find('#distance-submit-button');
        wrapper.setState({calculatedDistance: 20});
        submitButton.simulate('click');
        expect(calculatedDistance).toEqual(20);
        expect(wrapper.state().inputValues[0]).toEqual(null);
        expect(wrapper.state().inputValues[1]).toEqual(null);
        expect(isOpen).toBe(false);
    });

    it("has a functioning close button", () => {
        const closeButton = wrapper.find('#close-distance-modal');

        expect(isOpen).toBe(true);
        closeButton.simulate('click');
        expect(isOpen).toBe(false);
    });

    it('toggles isOpen correctly', () => {
        const modal = wrapper.find('#distance-modal');
        expect(modal).toBeDefined();

        expect(isOpen).toBe(true);
        modal.props()['toggle']();
        expect(isOpen).toBe(false);

        const header = wrapper.find(ModalHeader);
        expect(header).toBeDefined();
        expect(header.find('span').props()['children']).toEqual('Distance Between Coordinates');

        expect(isOpen).toBe(false);
        header.props().toggle();
        expect(isOpen).toBe(true);
    });

    it('correctly handles invalid distance response', () => {
        const response = {'name': 'This will not pass the schema.'}

        wrapper.setState({coordinatePairs: [{lat: 0, lng: 0}, {lat: 1, lng: 1}]});
        wrapper.instance().processDistanceResponse(response);
        expect(wrapper.state().coordinatePairs[0]).toEqual(null);
        expect(wrapper.state().coordinatePairs[1]).toEqual(null);
    })
});
