import './jestConfig/enzyme.config.js';
import {shallow} from 'enzyme'

import React from 'react'
import {ModalHeader} from 'reactstrap';
import {beforeEach, describe, it} from "@jest/globals";
import DestinationModal from '../src/components/Atlas/Modals/DestinationModal';
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";

describe('Destination Modal', () => {
    let wrapper;
    let wrapperNonTrip;
    let trip;
    let isOpen;

    const setTrip = (newTrip) => trip = newTrip;
    const toggleOpen = () => isOpen = !isOpen;

    beforeEach(() => {
        trip = new Trip().loadJSON(peaksTrip);
        isOpen = true;
        wrapper = shallow(
            <DestinationModal isOpen={isOpen} toggleOpen={toggleOpen} trip={trip} setTrip={setTrip}
                placeData={trip.itineraryPlaceData[2]} placeIndex={2} />
        );
        wrapperNonTrip = shallow(
            <DestinationModal isOpen={isOpen} toggleOpen={toggleOpen} trip={trip} setTrip={setTrip}
                placeData={{name: 'Home', latitude: '40.8', longitude: '-105.05'}} placeIndex={-1} />
        );
    });

    it('has a functioning save button', () => {
        const submitButton = wrapper.find('#destination-submit-button');
        expect(isOpen).toBe(true);
        submitButton.simulate('click');
        expect(isOpen).toBe(false);
    });

    it("has a functioning close button", () => {
        const closeButton = wrapper.find('#destination-close-button');

        expect(isOpen).toBe(true);
        closeButton.simulate('click');
        expect(isOpen).toBe(false);
    });

    it('toggles isOpen correctly', () => {
        const modal = wrapper.find('#destination-modal');
        expect(modal.length).toEqual(1);

        expect(isOpen).toBe(true);
        modal.props()['toggle']();
        expect(isOpen).toBe(false);

        const header = wrapper.find(ModalHeader);
        expect(header).toBeDefined();
        expect(header.find('span').props()['children']).toEqual('Destination Details');

        expect(isOpen).toBe(false);
        header.props().toggle();
        expect(isOpen).toBe(true);
    });

    it('updates name input', () => {
        const input = wrapper.find('#destination-name');
        expect(wrapper.state().name).toEqual('Mount Everest');
        input.simulate('change', {target: { value: 'Coffee Shop' }});
        expect(wrapper.state().name).toEqual('Coffee Shop');
    });

    it('updates coordinates input', () => {
        const input = wrapper.find('#destination-coordinates');
        expect(wrapper.state().coordinates).toEqual('27.988056, 86.925278');
        input.simulate('change', {target: { value: '10.1, 20.2' }});
        expect(wrapper.state().coordinates).toEqual('10.1, 20.2');
    });

    it('updates altitude input', () => {
        const input = wrapper.find('#destination-altitude');
        expect(wrapper.state().altitude).toEqual('29029');
        input.simulate('change', {target: { value: '10000' }});
        expect(wrapper.state().altitude).toEqual('10000');
    });

    it('updates country input', () => {
        const input = wrapper.find('#destination-country');
        expect(wrapper.state().country).toEqual('Nepal');
        input.simulate('change', {target: { value: 'Canada' }});
        expect(wrapper.state().country).toEqual('Canada');
    });

    it('updates region input', () => {
        const input = wrapper.find('#destination-region');
        expect(wrapper.state().region).toEqual('');
        input.simulate('change', {target: { value: 'New York' }});
        expect(wrapper.state().region).toEqual('New York');
    });

    it('updates municipality input', () => {
        const input = wrapper.find('#destination-municipality');
        expect(wrapper.state().municipality).toEqual('');
        input.simulate('change', {target: { value: 'Loveland' }});
        expect(wrapper.state().municipality).toEqual('Loveland');
    });

    it('updates notes input', () => {
        const input = wrapper.find('#destination-notes');
        expect(wrapper.state().notes).toEqual('');
        input.simulate('change', {target: { value: 'This is my favorite place.' }});
        expect(wrapper.state().notes).toEqual('This is my favorite place.');
    });

    it('updates the trip', () => {
        expect(isOpen).toEqual(true);
        expect(trip.places.length).toBeGreaterThan(0);
        wrapper.instance().updateTrip(new Trip());
        expect(isOpen).toEqual(false);
        expect(trip.places.length).toEqual(0);
    });

    it('autofill from a non-trip marker', () => {
        expect(wrapperNonTrip.state().name).toEqual('Home');
        expect(wrapperNonTrip.state().coordinates).toEqual('40.8, -105.05');
        expect(wrapperNonTrip.state().notes).toEqual('');
    })

    it('does not autofill if there is no data', () => {
        const wrapperNoData = shallow(
            <DestinationModal isOpen={isOpen} toggleOpen={toggleOpen} trip={trip} setTrip={setTrip}
                              placeData={{}} placeIndex={-1} />
        );

        expect(wrapperNoData.state().name).toEqual('');
        expect(wrapperNoData.state().coordinates).toEqual('');
        expect(wrapperNonTrip.state().notes).toEqual('');
    })
});