import './jestConfig/enzyme.config.js'
import {mount, shallow} from 'enzyme'

import React from 'react'
import Page from "../src/components/Page";
import Footer from '../src/components/Margins/Footer'
import ServerSettings from '../src/components/Margins/ServerSettings'
import {jest, test} from "@jest/globals";
import {PROTOCOL_VERSION} from "../src/utils/constants";

const startProperties = {
    serverSettings: {'serverPort': 'black-bottle.cs.colostate.edu:31400', 'serverConfig': {}},
    isOpen: true,
    toggleOpen: jest.fn(),
    processServerConfigSuccess: jest.fn(),
};

function testRender() {
    const footer = mount(
        <Footer
            serverSettings={startProperties.serverSettings}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);

    expect(footer.find('ServerSettings').length).toEqual(1);
}

test("Settings component should be rendered inside Footer", testRender);


function testRenderInput() {
    const settings = mount(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);

    expect(settings.find('Input').length).toEqual(1);
}

test('An Input field should be rendered inside the Settings', testRenderInput);


function testUpdateInputText() {
    const settings = shallow(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            processServerConfigSuccess={startProperties.processServerConfigSuccess}
        />);

    expect(settings.state().inputText).toEqual(startProperties.serverSettings.serverPort);

    let inputText = 'Fake Input Text';
    simulateOnChangeEvent(settings, {target: {value: inputText}});
    expect(settings.state().inputText).toEqual(inputText);
}

function simulateOnChangeEvent(reactWrapper, event) {
    reactWrapper.find('Input').at(0).simulate('change', event);
    reactWrapper.update();
}

test("onChangeEvent should update the component's state", testUpdateInputText);


function testUpdateServerPort() {
    mockConfigResponse();

    const page = mount(<Page />);
    const settings = shallow(
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
    settings.find('Button').at(1).simulate('click');

    let actualAfterServerPort = page.state().serverSettings.serverPort;

    expect(actualBeforeServerPort).toEqual(expectedBeforeServerPort);
    expect(actualAfterServerPort).toEqual(inputText);
}

function testRenderSettingsRow() {
    const settings = mount(
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
}

test('SettingsRow should have 5 rows and the correct values for the labels', testRenderSettingsRow);

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

test('onClick event for Save Button should update server port in Page component', testUpdateServerPort);

