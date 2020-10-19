import './jestConfig/enzyme.config.js';

import React from 'react';

import Trip from '../src/components/Atlas/Trip';
import {beforeEach, describe, it} from "@jest/globals";

describe('Trip', () => {

    let trip;

    beforeEach(() => {
        trip = new Trip();
    });

    it('initializes request info with no-args constructor', () => {
       expect(trip.requestVersion).toEqual(3);
       expect(trip.requestType).toEqual('trip');
    });

    it('sets title of trip to "My Trip" with no-args constructor', () => {
        expect(trip.title).toEqual('My Trip')
    });

    it('sets earthRadius to 3959.0 by default', () => {
       expect(trip.options.earthRadius).toEqual('3959.0');
    });

    it('sets places to empty array with no-args constructor', () => {
        let emptyArray = []
        expect(trip.places).toEqual(emptyArray);
    });

    it('sets distances to empty array with no-args constructor', () => {
        let emptyArray = []
        expect(trip.distances).toEqual(emptyArray);
    });

    it('adds new places to a new trip object', () => {
        let destination = {
            'name': 'Fort Collins',
            'latitude': '40.5853',
            'longitude': '-105.0844'
        };
        let newTrip = trip.addDestination(destination);
        expect(trip.places.length).toEqual(0);
        expect(newTrip.places.length).toEqual(1);
    });

    it('copies objects', () => {
        const newTrip = trip.copy(trip);
        expect(newTrip).toEqual(trip);
    });

    it('sets title of a trip', () => {
        let oldTripTitle = 'My Trip';
        let newTripTitle = 'World Tour';
        const newTrip = trip.setTitle(newTripTitle);
        expect(trip.title).toEqual(oldTripTitle);
        expect(newTrip.title).toEqual(newTripTitle);
    });

    it('returns original object if notes assigned to empty places array', () => {
        let note = 'Home of CSU';
        let place = 'Fort Collins'
        const newTrip = trip.addNote(place, note);
        expect(newTrip).toEqual(trip);
    });

    it('adds note to place', () => {
        let destination = {
            'name': 'Fort Collins',
            'latitude': '40.5853',
            'longitude': '-105.0844'
        };
        let note = 'Home of CSU';
        let newTrip = trip.addDestination(destination).addNote(0, note);
        expect(newTrip.places[0].notes).toEqual(note);
    });

    it('sets distances', () => {
        let expectedDistances = [1, 2, 3];
        let newTrip = trip.setDistance(expectedDistances);
        let actualDistances = newTrip.distances;
        expect(actualDistances).toEqual(expectedDistances);
    });

    it('loads a JSON file into properties', () => {
        let tripFile = {
            "requestType"    : "trip",
            "requestVersion" : 3,
            "options"        : { "title":"Shopping Loop",
            "earthRadius":"3959.0"
        },
            "places"         : [{"name":"Denver",       "latitude": "39° 44' 31.3548'' N", "longitude": "104° 59' 29.5116'' W", "notes":"The big city"},
            {"name":"Boulder",      "latitude": "40° 0' 53.9424'' N", "longitude": "105° 16' 13.9656'' W", "notes":"Home of CU"},
            {"name":"Fort Collins", "latitude": "40° 35' 6.9288'' N", "longitude": "105° 5' 3.9084'' W", "notes":"Home of CSU"}],
            "distances"      : [20, 40, 50]
        }
        let newTrip = trip.loadJSON(tripFile);
        expect(newTrip.title).toEqual('Shopping Loop');
        expect(newTrip.places.length).toEqual(3);
        expect(newTrip.distances).toEqual([20, 40, 50]);
    });

    it('creates a JSON tripFile', () => {
       let expectedJSON = {
           "requestType"    : "trip",
           "requestVersion" : 3,
           "options"        : { "title":"My Trip",
               "earthRadius":"3959.0"
           },
           "places"         : [],
           "distances"      : []
       }
       let actualJSON = trip.save();
       expect(actualJSON).toEqual(expectedJSON);
    });
});