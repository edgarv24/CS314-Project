import './jestConfig/enzyme.config.js';
import {shallow} from 'enzyme'
import {beforeEach, describe, it, jest} from "@jest/globals";

import React from 'react'
import {ModalHeader} from "reactstrap";
import Itinerary from "../src/components/Atlas/Itinerary/Itinerary";
import TripSettingsModal from '../src/components/Atlas/Modals/TripSettingsModal';
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";
import {EARTH_RADIUS_UNITS_DEFAULT} from "../src/utils/constants";

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
        wrapper = shallow(<TripSettingsModal trip={trip} setTrip={setTrip} resetTable={() => undefined}
                                             updatePlaceData={updatePlaceData} isOpen={isOpen}
                                             toggleOpen={toggleOpen}/>);
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
        input.simulate('change', {target: {value: 'New Trip Title'}});
        expect(wrapper.state().titleInput).toEqual('New Trip Title');
    });

    it('updates trip title on submit', () => {
        const input = wrapper.find('#settings-title-input');
        const submitButton = wrapper.find('#trip-settings-submit');
        expect(input).toBeDefined();

        input.simulate('change', {target: {value: 'New Trip Title'}});
        expect(trip.title).toEqual('Popular Peaks Round Trip');
        submitButton.simulate('click');
        expect(trip.title).toEqual('New Trip Title');
    });

    it('does not update trip title if input box empty', () => {
        const input = wrapper.find('#settings-title-input');
        const submitButton = wrapper.find('#trip-settings-submit');
        expect(input).toBeDefined();

        input.simulate('change', {target: {value: ''}});
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

    it('has a functioning clear trip button', () => {
        const clearTrip = wrapper.find('#clear-trip-button');
        expect(trip.places.length).toBeGreaterThan(0);
        clearTrip.simulate('click');
        expect(trip.places.length).toEqual(0);
    });

    it('has a functioning save dropdown menu', () => {
        const downloadMenu = wrapper.find('#download-menu');
        expect(downloadMenu.length).toEqual(1);
        const options = downloadMenu.find("option");
        expect(options.length).toEqual(5);
        downloadMenu.simulate('change', {target: {value: "JSON"}});
        expect(wrapper.state().selectedFormat).toEqual("JSON");
        downloadMenu.simulate('change', {target: {value: "CSV"}});
        expect(wrapper.state().selectedFormat).toEqual("CSV");
    });

    it('fails to process an invalid JSON file', () => {
        expect(wrapper.state().invalidUploadText).toEqual(null);
        const file = new File(['none'], "file.json", {type: "text/plain"});
        wrapper.instance().processFile(file);
        expect(wrapper.state().invalidUploadText).toEqual(null);
    });

    it('changes state after unit selection', () => {
        const select = wrapper.find('#unit-selector');

        expect(wrapper.state().selectedUnit).toEqual("miles");
        select.simulate('change', {target: {value: "kilometers"}});
        expect(wrapper.state().selectedUnit).toEqual("kilometers");

        expect(trip.units).toEqual("miles");
        const submit = wrapper.find('#trip-settings-submit');
        submit.simulate('click');
        expect(trip.units).toEqual("kilometers");
    });

    it('updates trip if settings inputs changed', () => {
        expect(trip.title).toEqual("Popular Peaks Round Trip");
        let updatedTrip = wrapper.instance().getUpdatedTripFromChanges();
        expect(updatedTrip).toEqual(trip);

        wrapper.setState({titleInput: "Mexican Food Round Trip"});
        updatedTrip = wrapper.instance().getUpdatedTripFromChanges();
        expect(updatedTrip).not.toEqual(trip);
        expect(updatedTrip.title).toEqual("Mexican Food Round Trip");

        wrapper.setState({selectedUnit: "inches"});
        updatedTrip = wrapper.instance().getUpdatedTripFromChanges();
        expect(updatedTrip).not.toEqual(trip);
        expect(updatedTrip.units).toEqual("inches");
        expect(updatedTrip.earthRadius).toEqual(EARTH_RADIUS_UNITS_DEFAULT["inches"]);
    });
});