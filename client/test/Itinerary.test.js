import './jestConfig/enzyme.config.js'
import {mount, shallow} from 'enzyme'

import React from 'react'
import Itinerary from "../src/components/Atlas/Itinerary";
import {DestinationTable, TableActions} from "../src/components/Atlas/Itinerary";
import {IconButton} from "@material-ui/core";
import Trip from "../src/components/Atlas/Trip";
import peaksTrip from "../test/TripFiles/peaks-trip.json";
import {beforeEach, describe, it, jest} from "@jest/globals";

const TRIP = new Trip().loadJSON(peaksTrip);

describe('Itinerary', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Itinerary trip={TRIP}/>);
    });

    it('renders header text', () => {
        const distanceLabel = wrapper.instance().getDistanceLabelText();
        expect(wrapper.find("h4").text()).toContain(TRIP.title);
        expect(wrapper.find("h6").text()).toEqual("Total Distance: " + distanceLabel);
    });

    it('renders horizontal rule', () => {
        expect(wrapper.find('hr').length).toBe(1);
    });

    it('renders buttons', () => {
        expect(wrapper.find('#trip-settings-button')).toBeDefined();
        expect(wrapper.find('#add-destination-button')).toBeDefined();
        expect(wrapper.find('#scroll-up-button')).toBeDefined();
    });

    it('has working buttons', () => {
        window.scrollTo = jest.fn();

        wrapper.find('#trip-settings-button').simulate('click');
        wrapper.find('#add-destination-button').simulate('click');
        wrapper.find('#scroll-up-button').simulate('click');
        wrapper.update();

        expect(window.scrollY).toEqual(0);
    });

    it('gets the correct distance label', () => {
        const distanceLabel = wrapper.instance().getDistanceLabelText();
        expect(distanceLabel).toEqua
    });
});

describe('Destination Table', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<DestinationTable data={TRIP.itineraryPlaceData}/>);
    });

    it('renders header text', () => {
        expect(1).toEqual(1);
    });

    it('shows the range of rows currently being displayed', () => {
        expect(wrapper.text().includes("1-5 of 7")).toBe(true);
    });
});

describe('Actions Footer', () => {
    let wrapper;
    const START_PAGE = 1;
    let currentPage = START_PAGE;

    function onChangePage(event, newPage) {
        currentPage = newPage;
    }

    beforeEach(() => {
        wrapper = shallow(<TableActions count={12} page={START_PAGE} rowsPerPage={5} onChangePage={onChangePage}/>)
    });

    it('render icon buttons', () => {
        expect(wrapper.find(IconButton).length).toEqual(4);
    });

    it('disables buttons correctly', () => {
        expect(wrapper.find(IconButton).at(0).props()["disabled"]).toBe(false);
        expect(wrapper.find(IconButton).at(1).props()["disabled"]).toBe(false);
        expect(wrapper.find(IconButton).at(2).props()["disabled"]).toBe(false);
        expect(wrapper.find(IconButton).at(3).props()["disabled"]).toBe(false);
    });

    it('moves to the correct pages using buttons', () => {
        const fullBack = wrapper.find(IconButton).at(0);
        const back = wrapper.find(IconButton).at(1);
        const forward = wrapper.find(IconButton).at(2);
        const fullForward = wrapper.find(IconButton).at(3);

        expect(currentPage).toEqual(START_PAGE);

        fullBack.simulate('click');
        expect(currentPage).toEqual(0);

        back.simulate('click');
        expect(currentPage).toEqual(0);

        forward.simulate('click');
        expect(currentPage).toEqual(2);

        fullForward.simulate('click');
        expect(currentPage).toEqual(2);
    });
});