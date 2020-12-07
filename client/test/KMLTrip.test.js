import './jestConfig/enzyme.config.js';

import React from 'react';

import KMLTrip from '../src/components/Atlas/KMLTrip';
import Trip from "../src/components/Atlas/Trip";
import {beforeEach, describe, it} from "@jest/globals";

describe('KMLTrip', () => {
    let kmltrip;
    let trip;
    let newTrip;
    let myTrip;
    let expectedKML =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n" +
        "\t<Document>\n" +
        "\t\t<name>My Trip 2020</name>\n" +
        "\t\t<open>1</open>\n" +
        "\t\t<description>User KML Trip</description>\n" +
        "\t\t<Style id=\"CrossStyle\">\n" +
        "\t\t\t<LineStyle>\n" +
        "\t\t\t\t<color>ffffffb6</color>\n" +
        "\t\t\t\t<width>4</width>\n" +
        "\t\t\t</LineStyle>\n" +
        "\t\t</Style>\n" +
        "\t\t<Placemark>\n" + "" +
        "\t\t\t<name>My Trip 2020</name>\n" +
        "\t\t\t<styleURL>#CrossStyle</styleURL>\n" +
        "\t\t\t<LineString>\n" +
        "\t\t\t\t<coordinates>\n" +
        "\t\t\t\t\t40,10\n" +
        "\t\t\t\t\t50,20\n" +
        "\t\t\t\t\t60,30\n" +
        "\t\t\t\t</coordinates>\n" +
        "\t\t\t</LineString>\n" +
        "\t\t</Placemark>\n" +
        "\t</Document>\n" +
        "</kml>";

    beforeEach(() => {
        kmltrip = new KMLTrip();
        trip = new Trip();

        const p1 = {'name': 'Place 1', 'latitude': '10', 'longitude': '40'};
        const p2 = {'name': 'Place 2', 'latitude': '20', 'longitude': '50'};
        const p3 = {'name': 'Place 3', 'latitude': '30', 'longitude': '60'};

        newTrip = trip.addPlaces([p1, p2, p3]);
        myTrip = newTrip.setTitle("My Trip 2020");
    })
    it('Constructs a KML header', () => {
        const kmlHeader = kmltrip.constructHeader();
        const expectedHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        expect(kmlHeader).toEqual(expectedHeader);
    });

    it('Constructs a KML namespace', () => {
        const kmlNamespace = kmltrip.constructNamespace();
        const expectedNamespace = "<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n";
        expect(kmlNamespace).toEqual(expectedNamespace);
    });

    it('Constructs coordinates from trip to kml format', () => {
        const kmlCoordinates = kmltrip.getTripCoordinates(newTrip);
        const expectedCoordinates =
            "\t\t\t\t\t40,10\n" +
            "\t\t\t\t\t50,20\n" +
            "\t\t\t\t\t60,30\n";
        expect(kmlCoordinates).toEqual(expectedCoordinates);
    });

    it('Constructs a Placemark', () => {
        const kmlPlacemark = kmltrip.constructPlacemark(myTrip);
        const expectedPlacemark =
            "\t\t<Placemark>\n" + "" +
            "\t\t\t<name>My Trip 2020</name>\n" +
            "\t\t\t<styleURL>#CrossStyle</styleURL>\n" +
            "\t\t\t<LineString>\n" +
            "\t\t\t\t<coordinates>\n" +
            "\t\t\t\t\t40,10\n" +
            "\t\t\t\t\t50,20\n" +
            "\t\t\t\t\t60,30\n" +
            "\t\t\t\t</coordinates>\n" +
            "\t\t\t</LineString>\n" +
            "\t\t</Placemark>\n";
        expect(kmlPlacemark).toEqual(expectedPlacemark);
    });

    it('Constructs a name, open status and description', () => {
        const kmlDescription = kmltrip.constructDescription(myTrip);
        const expectedDescription =
            "\t\t<name>My Trip 2020</name>\n" +
            "\t\t<open>1</open>\n" +
            "\t\t<description>User KML Trip</description>\n";
        expect(kmlDescription).toEqual(expectedDescription);
    });

    it('Constructs the style tag', () => {
        const kmlStyle = kmltrip.constructStyle();
        const expectedStyle =
            "\t\t<Style id=\"CrossStyle\">\n" +
            "\t\t\t<LineStyle>\n" +
            "\t\t\t\t<color>ffffffb6</color>\n" +
            "\t\t\t\t<width>4</width>\n" +
            "\t\t\t</LineStyle>\n" +
            "\t\t</Style>\n";
        expect(kmlStyle).toEqual(expectedStyle);
    });

    it('Constructs a complete KML file', () => {
        const kml = kmltrip.constructKML(myTrip);
        expect(kml).toEqual(expectedKML);
    });
});