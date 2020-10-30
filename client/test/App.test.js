import './jestConfig/enzyme.config.js';

import React from 'react';
import {shallow} from 'enzyme';

import App, {HookCaller} from "../src/components/App";
import {beforeEach, describe, it} from "@jest/globals";

import { SnackbarProvider } from 'notistack';

describe('App', () => {
    let app;

    beforeEach(() => {
        app = shallow(<App />);
    });

    it('has a snackbar provider', () => {
        expect(app.find(SnackbarProvider).length).toEqual(1);
    });

    it('has a hook caller', () => {
        expect(app.find(HookCaller).length).toEqual(1);
    });
});
