import './jestConfig/enzyme.config.js';
import {shallow} from 'enzyme'

import React from 'react'
import Itinerary from "../src/components/Atlas/Itinerary/Itinerary";
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";
import {beforeEach, describe, it, jest} from "@jest/globals";

const TRIP = new Trip().loadJSON(peaksTrip);

import TripSettingsModal from '../src/components/Atlas/Modals/TripSettingsModal';

describe('Itinerary', () => {
    let wrapper;
    let trip;
    let isOpen;

    const setTrip = (newTrip) => trip = newTrip;
    const toggleOpen = (open) => isOpen = !open;
    const updatePlaceData = jest.fn();

    beforeEach(() => {
        trip = new Trip().loadJSON(peaksTrip);
        isOpen = true;
        wrapper = shallow(<TripSettingsModal trip={TRIP} setTrip={setTrip} updatePlaceData={updatePlaceData} isOpen={isOpen} toggleOpen={toggleOpen}/>);
    });

    it("renders inputs", () => {
        expect(wrapper.find('Input').length).toEqual(2);
    });

    it("renders buttons", () => {
        expect(wrapper.find('Button').length).toEqual(5);
    });

    it("has buttons that work", () => {
        const closeButton = wrapper.find('Button').at(0);
        const submitButton = wrapper.find('Button').at(1);
        closeButton.simulate('click');
        submitButton.simulate('click');
    });
});