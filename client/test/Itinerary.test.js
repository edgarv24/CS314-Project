import './jestConfig/enzyme.config.js'
import {mount, shallow} from 'enzyme'

import React from 'react'
import Itinerary from "../src/components/Atlas/Itinerary/Itinerary";
import TripSettingsModal from "../src/components/Atlas/Modals/TripSettingsModal";
import {DestinationTable, DestinationTableRow, TableActions} from "../src/components/Atlas/Itinerary/DestinationTable";
import {IconButton, TableRow} from "@material-ui/core";
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

        wrapper.find('#scroll-up-button').simulate('click');
        wrapper.update();
        expect(window.scrollY).toEqual(0);

        wrapper.find('#trip-settings-button').simulate('click');
        expect(wrapper.state().settingsModalOpen).toBe(true);

        wrapper.find('#add-destination-button').simulate('click');
    });

    it('gets the correct distance label', () => {
        const distanceLabel = wrapper.instance().getDistanceLabelText();
        expect(distanceLabel).toEqual("22201 miles");
    });

    it('toggles trip settings modal', () => {
        const modal = wrapper.find(TripSettingsModal);
        expect(modal).toBeDefined();

        expect(wrapper.state().settingsModalOpen).toBe(false);
        modal.props()['toggleOpen']();
        expect(wrapper.state().settingsModalOpen).toBe(true);
    });
});

describe('Destination Table', () => {
    let wrapper;
    let trip;

    const setTrip = (newTrip) => trip = newTrip;

    beforeEach(() => {
        trip = TRIP;
        wrapper = shallow(<DestinationTable
            trip={trip}
            setTrip={setTrip}
            data={trip.itineraryPlaceData}
            units={trip.units}
        />);
    });

    it('shows the range of rows currently being displayed', () => {
        wrapper = mount(<DestinationTable
            trip={trip}
            setTrip={setTrip}
            data={trip.itineraryPlaceData}
            units={trip.units}
        />);
        expect(wrapper.text().includes("1-5 of 7")).toBe(true);
    });

    it('correctly sets a new open row', () => {
        const firstRow = wrapper.find(DestinationTableRow).at(0);
        firstRow.props()['setOpenRow'](2);
        expect(wrapper.state().openRow).toEqual(2);
    });

    it('handles a page change', () => {
        expect(wrapper.state().page).toEqual(0);
        wrapper.instance().handleChangePage({}, 2);
        expect(wrapper.state().page).toEqual(2);
    });

    it('handles a change in rows per page', () => {
        expect(wrapper.state().rowsPerPage).toEqual(5);
        wrapper.instance().handleChangeRowsPerPage({target: {value: "10"}});
        expect(wrapper.state().rowsPerPage).toEqual(10);
    });

    it('calculates row data to render', () => {
        wrapper.setState({rowsPerPage: 5});
        let dataToRender = wrapper.instance().calculateRowsToRender();
        expect(dataToRender.length).toEqual(5);

        wrapper.setState({rowsPerPage: -1});
        dataToRender = wrapper.instance().calculateRowsToRender();
        expect(dataToRender.length).toEqual(TRIP.itineraryPlaceData.length);
    });
});

describe('Destination Table Row', () => {
    let wrapper;
    let openRow;
    let trip;
    let destinationModalOpen;

    const setTrip = (newTrip) => trip = newTrip;

    beforeEach(() => {
        trip = TRIP;
        openRow = 0;
        destinationModalOpen = false;

        wrapper = shallow(
            <DestinationTableRow
                key='destination-3'
                trip={trip}
                setTrip={setTrip}
                editPlace={(index) => destinationModalOpen = true}
                rowData={trip.itineraryPlaceData[2]}
                index={2}
                units={trip.units}
                canEditRow={true}
                collapseIsOpen={false}
                setOpenRow={(row) => openRow = row} />);
    });

    it('toggles collapse when clicked', () => {
        const tableRow = wrapper.find(TableRow).at(0);
        expect(openRow).toEqual(0);
        tableRow.props()['onClick']();
        expect(openRow).toEqual(2);

        wrapper.setProps({collapseIsOpen: true});
        tableRow.props()['onClick']();
        expect(openRow).toEqual(-1);
    });

    it('has functioning buttons', () => {
        expect(trip.itineraryPlaceData[2].id).toEqual('destination-3');
        const editButton = wrapper.find('#edit-destination-3');
        const removeButton = wrapper.find('#remove-destination-3');

        expect(trip.places.length).toEqual(TRIP.places.length);
        removeButton.simulate('click');
        expect(trip.places.length).toEqual(TRIP.places.length - 1);

        editButton.simulate('click');
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