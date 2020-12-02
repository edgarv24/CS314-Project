import './jestConfig/enzyme.config.js';

import {describe, it} from "@jest/globals";
import {correctUnits, capitalize, getCountryID, getFlagIcon, getCoordinateOrNull} from "../src/utils/constants";

describe('Constant Helper Functions', () => {
    it('returns the correct units', () => {
        const result = correctUnits('miles', 1);
        expect(result).toEqual('mile');

        const result2 = correctUnits('miles', 10);
        expect(result2).toEqual('miles');
    });

    it('capitalizes a string correctly', () => {
        const result = capitalize('tHiS Is A teST.');
        expect(result).toEqual('This is a test.');
    });

    it('returns the correct country ID', () => {
        const result = getCountryID('United States');
        expect(result).toEqual('US');

        const result2 = getCountryID('Thailand');
        expect(result2).toEqual('TH');
    });

    it('returns the correct flag icon', () => {
        const result = getFlagIcon('US');
        expect(result).toEqual('🇺🇸');

        const result2 = getFlagIcon('ZZ');
        expect(result2).toEqual(null);
    });

    it('returns the correct coordinates', () => {
        const result = getCoordinateOrNull('11.11, -33.33');
        expect(result.getLatitude()).toEqual(11.11);
        expect(result.getLongitude()).toEqual(-33.33);

        const result2 = getCoordinateOrNull('Invalid Input');
        expect(result2).toEqual(null);
    });
});
