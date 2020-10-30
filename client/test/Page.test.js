import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import Page from "../src/components/Page";
import Header from "../src/components/Margins/Header";
import Footer from "../src/components/Margins/Footer";
import About from "../src/components/About/About";
import Atlas from "../src/components/Atlas/Atlas";
import {beforeEach, describe, it, jest} from "@jest/globals";
import {LOG, PROTOCOL_VERSION} from "../src/utils/constants";
import IconButton from "@material-ui/core/IconButton";
import ServerSettings from "../src/components/Margins/ServerSettings";

const startProperties = {
    createSnackBar: jest.fn()
};

describe('Page', () => {
    let page;

    beforeEach(() => {
        page = shallow(<Page createSnackBar={startProperties.createSnackBar}/>);
    });

    it('renders header', () => {
        expect(page.find(Header).length).toEqual(1);
    });

    it('renders footer', () => {
        expect(page.find(Footer).length).toEqual(1);
    });

    it('renders about', () => {
        expect(page.find(About).length).toEqual(1);
    });

    it('renders atlas', () => {
        expect(page.find(Atlas).length).toEqual(1);
    });

    it('toggles about', () => {
        expect(page.state().showAbout).toBe(false);
        page.instance().toggleAbout();
        expect(page.state().showAbout).toBe(true);
    });

    it('processes server request success', () => {
        LOG.error = jest.fn();
        const response = {"requestVersion": PROTOCOL_VERSION, "requestType": "config",
            "serverName": "t14 The Fourteeners", "supportedRequests": []};
        page.instance().processConfigResponse(response);
        expect(page.state().serverSettings.serverConfig.requestType).toEqual("config");
        expect(page.state().serverSettings.serverConfig.requestVersion).toEqual(PROTOCOL_VERSION);
        expect(page.state().serverSettings.serverPort.length).toBeGreaterThan(0);
    });

    it('processes server request error', () => {
        LOG.error = jest.fn();
        page.instance().processConfigResponse({});
        expect(page.state().serverSettings.serverConfig).toBe(null);
    });
});

describe('Footer', () => {
    let footer;

    beforeEach(() => {
        footer = shallow(<Footer
            serverSettings={{'serverConfig': {'requestType': 'config', 'requestVersion': PROTOCOL_VERSION,
                'serverName': 't14 The Fourteeners', 'supportedRequests': []}, 'serverPort': 'http://localhost:8000'}}
            processServerConfigSuccess={jest.fn()}/>);
    });

    it('opens Server Settings', () => {
        expect(footer.state().serverSettingsOpen).toBe(false);
        footer.find(IconButton).simulate('click');
        expect(footer.state().serverSettingsOpen).toBe(true);
    });

    it('closes Server Settings', () => {
        const settings = footer.find(ServerSettings).at(0);
        expect(footer.setState({serverSettingsOpen: true}));
        settings.props()['toggleOpen']();
        expect(footer.state().serverSettingsOpen).toBe(false);
    });
});