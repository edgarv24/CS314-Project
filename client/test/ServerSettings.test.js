import './jestConfig/enzyme.config.js'
import {mount, shallow} from 'enzyme'

import React from 'react'
import Page from "../src/components/Page";
import Footer from '../src/components/Margins/Footer'
import ServerSettings from '../src/components/Margins/ServerSettings'
import {ModalHeader} from 'reactstrap';
import {beforeEach, jest, test} from "@jest/globals";
import {PROTOCOL_VERSION} from "../src/utils/constants";

const startProperties = {
    serverSettings: {'serverPort': 'black-bottle.cs.colostate.edu:31400', 'serverConfig': {}},
    isOpen: true,
    toggleOpen: jest.fn(),
    processServerConfigSuccess: jest.fn(),
};

let settings;
let isOpen;

beforeEach(() => {
    isOpen = true;
    settings = shallow(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={() => isOpen = !isOpen}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);
});

test("Settings component should be rendered inside Footer", () => {
    const footer = mount(
        <Footer
            serverSettings={startProperties.serverSettings}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);

    expect(footer.find('ServerSettings').length).toEqual(1);
});

test('An Input field should be rendered inside the Settings', () => {
    expect(settings.find('Input').length).toEqual(1);
});

test("onChangeEvent should update the component's state", () => {
    expect(settings.state().inputText).toEqual(startProperties.serverSettings.serverPort);

    let inputText = 'Fake Input Text';
    simulateOnChangeEvent(settings, {target: {value: inputText}});
    expect(settings.state().inputText).toEqual(inputText);
});

function simulateOnChangeEvent(reactWrapper, event) {
    reactWrapper.find('Input').at(0).simulate('change', event);
    reactWrapper.update();
}

test('onClick event for Save Button should update server port in Page component', () => {
    mockConfigResponse();

    const page = mount(<Page />);
    settings = shallow(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            processServerConfigSuccess={(value, config) => page.instance().processServerConfigSuccess(value, config)}
        />);

    let actualBeforeServerPort = page.state().serverSettings.serverPort;
    let expectedBeforeServerPort = `http://${location.hostname}:`;

    let inputText = 'https://black-bottle.cs.colostate.edu:31400';
    simulateOnChangeEvent(settings, {target: {value: inputText}});
    settings.find('Button').at(0).simulate('click');

    let actualAfterServerPort = page.state().serverSettings.serverPort;

    expect(actualBeforeServerPort).toEqual(expectedBeforeServerPort);
    expect(actualAfterServerPort).toEqual(inputText);
});

test('SettingsRow should have 5 rows and the correct values for the labels', () => {
    settings = mount(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);
    expect(settings.find('Row').length).toEqual(7);
    expect(settings.find('Row').at(1).text()).toMatch("Type:config");
    expect(settings.find('Row').at(2).text()).toMatch("Version:" + PROTOCOL_VERSION);
    expect(settings.find('Row').at(3).text()).toMatch("Supported:config, distance, find, trip");
    expect(settings.find('Row').at(4).text()).toMatch("Airport Filters:airport, balloonport, heliport");
    expect(settings.find('Row').at(5).text()).toMatch("Geographic Filters:country");
});

test('Toggle should open and close modal', () => {
    const modal = settings.find('#server-settings-modal');
    expect(modal).toBeDefined();

    expect(isOpen).toBe(true);
    modal.props()['toggle']();
    expect(isOpen).toBe(false);

    const header = settings.find(ModalHeader);
    expect(header).toBeDefined();
    expect(header.find('span').props()['children']).toEqual('Server Connection');

    expect(isOpen).toBe(false);
    header.props().toggle();
    expect(isOpen).toBe(true);
});

test('Close button functions correctly', () => {
    const closeButton = settings.find('#close-server-settings');

    expect(isOpen).toBe(true);
    closeButton.props()['onClick']();
    expect(isOpen).toBe(false);
});

test('Config response success', () => {
    const response = {serverName: "t14 The Fourteeners", supportedRequests: [],
        filters: {}, requestType: "config", requestVersion: 4};
    settings.instance().processConfigResponse(response);
    expect(settings.state().validServer).toBe(true);
    expect(settings.state().config).toEqual(response);
});

test('Config response failure', () => {
    const response = {serverName: "This does not match the schema."};
    settings.instance().processConfigResponse(response);
    expect(settings.state().validServer).toBe(false);
    expect(settings.state().config).toBe(false);
});

function mockConfigResponse() {
    fetch.mockResponse(JSON.stringify(
        {
            'placeAttributes': ["latitude", "longitude", "name"],
            'requestType': "config",
            'requestVersion': 1,
            'serverName': "t14 The Fourteeners",
            'supportedRequests': ["config","distance","find", "trip"]
        }));
}