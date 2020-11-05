import './jestConfig/enzyme.config.js';
import {shallow} from 'enzyme'

import React from 'react'
import Itinerary from "../src/components/Atlas/Itinerary/Itinerary";
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";
import {beforeEach, describe, it, jest} from "@jest/globals";

const TRIP = new Trip().loadJSON(peaksTrip);

import TripSettingsModal from '../src/components/Atlas/Modals/TripSettingsModal';
import {ModalHeader} from "reactstrap";

describe('Itinerary', () => {
    let wrapper;
    let trip;
    let isOpen;

    const setTrip = (newTrip) => trip = newTrip;
    const toggleOpen = () => isOpen = !isOpen;
    const updatePlaceData = jest.fn();

    beforeEach(() => {
        trip = new Trip().loadJSON(peaksTrip);
        isOpen = true;
        wrapper = shallow(<TripSettingsModal trip={TRIP} setTrip={setTrip} updatePlaceData={updatePlaceData} isOpen={isOpen} toggleOpen={toggleOpen}/>);
    });

    it("renders inputs", () => {
        expect(wrapper.find('Input').length).toEqual(2);
    });

    it("has a functioning close button", () => {
        const closeButton = wrapper.find('#close-trip-settings');

        expect(isOpen).toBe(true);
        closeButton.simulate('click');
        expect(isOpen).toBe(false);
    });

    it('toggles isOpen correctly', () => {
        const modal = wrapper.find('#trip-settings-modal');
        expect(modal).toBeDefined();

        expect(isOpen).toBe(true);
        modal.props()['toggle']();
        expect(isOpen).toBe(false);

        const header = wrapper.find(ModalHeader);
        expect(header).toBeDefined();
        expect(header.find('span').props()['children']).toEqual('Trip Settings');

        expect(isOpen).toBe(false);
        header.props().toggle();
        expect(isOpen).toBe(true);
    });

    it('updates titleInput on input box change', () => {
        const input = wrapper.find('#settings-title-input');
        expect(input).toBeDefined();
        expect(wrapper.state().titleInput).toEqual('');
        input.simulate('change', {target: { value: 'New Trip Title' }});
        expect(wrapper.state().titleInput).toEqual('New Trip Title');
    });

    it('updates trip title on submit', () => {
        const input = wrapper.find('#settings-title-input');
        const submitButton = wrapper.find('#trip-settings-submit');
        expect(input).toBeDefined();

        input.simulate('change', {target: { value: 'New Trip Title' }});
        expect(trip.title).toEqual('Popular Peaks Round Trip');
        submitButton.simulate('click');
        expect(trip.title).toEqual('New Trip Title');
    });

    it('does not update trip title if input box empty', () => {
        const input = wrapper.find('#settings-title-input');
        const submitButton = wrapper.find('#trip-settings-submit');
        expect(input).toBeDefined();

        input.simulate('change', {target: { value: '' }});
        expect(trip.title).toEqual('Popular Peaks Round Trip');
        submitButton.simulate('click');
        expect(trip.title).toEqual('Popular Peaks Round Trip');
    });

    it('loads trip from Co-Brews button', () => {
        const loadCOBrews = wrapper.find('#load-co-brews');
        expect(loadCOBrews).toBeDefined();

        expect(trip.title).toEqual('Popular Peaks Round Trip');
        loadCOBrews.simulate('click');
        expect(trip.title).toEqual('Colorado Brews Tour');
    });
});