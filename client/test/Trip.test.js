import './jestConfig/enzyme.config.js';

import React from 'react';

import Trip from '../src/components/Atlas/Trip';
import {beforeEach, describe, it} from "@jest/globals";

describe('Trip', () => {

    let trip;
    let mockTripResponse = { "data": {
            "options": {
                "title": "Eurotrip from Denver",
                "earthRadius": "3959.0"
            },
            "places": [
                {
                    "name": "Place 1",
                    "latitude": "10",
                    "longitude": "40"
                },
                {
                    "name": "Place 2",
                    "latitude": "20",
                    "longitude": "50"
                },
                {
                    "name": "Place 3",
                    "latitude": "30",
                    "longitude": "60"
                }
            ],
            "distances": [
                960,
                932,
                1889
            ],
            "requestType": "trip",
            "requestVersion": 3
        }};

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

    it('gets earth radius', () => {
        let expectedEarthRadius = '3959.0';
        let actualEarthRadius = trip.earthRadius;
        expect(actualEarthRadius).toEqual(expectedEarthRadius);
    });

    it('adds new places to a new trip object', () => {
        let place = {
            'name': 'Fort Collins',
            'latitude': '40.5853',
            'longitude': '-105.0844'
        };
        let newTrip = trip.addPlace(place);
        expect(trip.places.length).toEqual(0);
        expect(newTrip.places.length).toEqual(1);
    });

    it('adds multiple places at once', () => {
        let newTrip = trip.addPlace({'name': 'a', 'latitude': '0', 'longitude': '0'});
        expect(trip.places.length).toEqual(0);
        expect(newTrip.places.length).toEqual(1);

        const places = [{'name': 'Place 1', 'latitude': '0', 'longitude': '0'},
            {'name': 'Place 2', 'latitude': '0', 'longitude': '0'},
            {'name': 'Place 3', 'latitude': '0', 'longitude': '0'}];
        newTrip = newTrip.addPlaces(places);
        expect(trip.places.length).toEqual(0);
        expect(newTrip.places.length).toEqual(4);
    });

    it('removes a places at an index', () => {
        const p1 = {'name': 'Place 1', 'latitude': '0', 'longitude': '0'};
        const p2 = {'name': 'Place 2', 'latitude': '0', 'longitude': '0'};
        const p3 = {'name': 'Place 3', 'latitude': '0', 'longitude': '0'};
        let newTrip = trip.addPlaces([p1, p2, p3]);
        expect(trip.places.length).toEqual(0);
        expect(newTrip.places.length).toEqual(3);

        newTrip = newTrip.removeAtIndex(1);
        expect(newTrip.places.length).toEqual(2);
        expect(newTrip.places[1].name).toEqual('Place 3');
    });

    it('sets title of a trip', () => {
        let oldTripTitle = 'My Trip';
        let newTripTitle = 'World Tour';
        const newTrip = trip.setTitle(newTripTitle);
        expect(trip.title).toEqual(oldTripTitle);
        expect(newTrip.title).toEqual(newTripTitle);
    });

    it('copies objects', () => {
        const newTrip = trip.copy();
        expect(newTrip).toEqual(trip);
    });

    it('returns original object if notes assigned to empty places array', () => {
        let note = 'Home of CSU';
        const newTrip = trip.addNote(0, note);
        expect(newTrip).toEqual(trip);
    });

    it('adds note to place', () => {
        let place = {
            'name': 'Fort Collins',
            'latitude': '40.5853',
            'longitude': '-105.0844'
        };
        let note = 'Home of CSU';
        let newTrip = trip.addPlace(place).addNote(0, note);
        expect(newTrip.places[0].notes).toEqual(note);
    });

    it('returns original object if index greater than length', () => {
        let place = {
            'name': 'Fort Collins',
            'latitude': '40.5853',
            'longitude': '-105.0844'
        };
        let note = 'Home of CSU';
        let temp = trip.addPlace(place);
        let newTrip = temp.addNote(10, note);
        expect(newTrip).toEqual(temp);
    })

    it('sets distances', () => {
        let expectedDistances = [1, 2, 3];
        let newTrip = trip.setDistances(expectedDistances);
        let actualDistances = newTrip.distances;
        expect(actualDistances).toEqual(expectedDistances);
    });

    it('loads a JSON file into properties', () => {
        let tripFile = {
            "requestType": "trip",
            "requestVersion": 3,
            "options": {
                "title": "Shopping Loop",
                "earthRadius": "3959.0"
            },
            "places": [
                {
                    "name": "Denver",
                    "latitude": "39° 44' 31.3548'' N",
                    "longitude": "104° 59' 29.5116'' W",
                    "notes": "The big city"
                },
                {
                    "name": "Boulder",
                    "latitude": "40° 0' 53.9424'' N",
                    "longitude": "105° 16' 13.9656'' W",
                    "notes": "Home of CU"
                },
                {
                    "name": "Fort Collins",
                    "latitude": "40° 35' 6.9288'' N",
                    "longitude": "105° 5' 3.9084'' W",
                    "notes": "Home of CSU"
                }],
            "distances": [20, 40, 50]
        }
        let newTrip = trip.loadJSON(tripFile);
        expect(newTrip.title).toEqual('Shopping Loop');
        expect(newTrip.places.length).toEqual(3);
        expect(newTrip.distances).toEqual([20, 40, 50]);
    });

    it('creates a JSON tripFile', () => {
        let expectedJSON = {
            "requestType": "trip",
            "requestVersion": 3,
            "options": {
                "title": "My Trip",
                "earthRadius": "3959.0"
            },
            "places": [],
            "distances": []
        }
        let actualJSON = trip.build();
        expect(actualJSON).toEqual(expectedJSON);
    });

    it('returns a list of coordinate objects', () => {
        const p1 = {'name': 'Place 1', 'latitude': '10', 'longitude': '40'};
        const p2 = {'name': 'Place 2', 'latitude': '20', 'longitude': '50'};
        const p3 = {'name': 'Place 3', 'latitude': '30', 'longitude': '60'};

        const newTrip = trip.addPlaces([p1, p2, p3]);
        const expectedList = [{lat: 10, lng: 40}, {lat: 20, lng: 50}, {lat: 30, lng: 60}];
        expect(newTrip.coordinatesList).toEqual(expectedList);
    });

    it('returns place data compatible with the itinerary', () => {
        const p1 = {'name': 'Water Park', 'municipality': 'London', 'country': 'England',
            'latitude': '8', 'longitude': '24', 'notes': 'fun'};
        const p2 = {'name': 'Zoo', 'municipality': 'Denver', 'state': 'Colorado', 'country': 'United States',
            'latitude': '3', 'longitude': '7'};

        const newTrip = trip.addPlaces([p1, p2]);
        const itineraryData = newTrip.itineraryPlaceData;

        const expected1 = {"id": "destination-1", "name": "Water Park", "latitude": "8", "longitude": "24", "municipality": "London",
            "state": "", "country": "England", "altitude": "", "notes": "fun", "leg_dist": 0, "cumulative_dist": 0};
        const expected2 = {"id": "destination-2", "name": "Zoo", "latitude": "3", "longitude": "7", "municipality": "Denver",
            "state": "Colorado", "country": "United States", "altitude": "", "notes": "", "leg_dist": 0, "cumulative_dist": 0};

        expect(itineraryData[0]).toEqual(expected1);
        expect(itineraryData[1]).toEqual(expected2);
    });

    it('sends requests to server to update distances', () => {
        trip.updateDistance(mockTripResponse, trip);
        let expectedDistances = [960, 932, 1889];
        expect(trip.distances).toEqual(expectedDistances);
    });

    it('does not alter distances with bad coordinates', () => {
       const invalidPlace = {"name": "place1", "latitude": "40 W", "longitude": "40 N"};

       const newTrip = trip.addPlace(invalidPlace);
       expect(newTrip.places).toEqual(trip.places);
    });

    it('checks multiple places for valid coordinates', () => {
        const p1 = {'name': 'Place 1', 'latitude': '10', 'longitude': '40'};
        const p2 = {'name': 'Place 2', 'latitude': '20', 'longitude': '50'};
        const p3 = {'name': 'Place 3', 'latitude': '30 W', 'longitude': '60 N'};

        expect(trip.checkValidCoordinates([p1, p2, p3])).toEqual(false);
    });



});