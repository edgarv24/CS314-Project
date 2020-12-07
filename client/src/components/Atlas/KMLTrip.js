export default class KMLTrip {
    constructHeader = () => {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    }

    constructNamespace = () => {
        return "<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n"
    }

    getTripCoordinates = trip => {
        let coordinates = "";
        trip.places.map(place => {
            coordinates += `\t\t\t\t\t${place.longitude},${place.latitude}\n`
        });
        return coordinates;
    }

    constructPlacemark = trip => {
        return "\t\t<Placemark>\n" + "" +
            `\t\t\t<name>${trip.title}</name>\n` +
            "\t\t\t<styleURL>#CrossStyle</styleURL>\n" +
            "\t\t\t<LineString>\n" +
            "\t\t\t\t<coordinates>\n" +
            this.getTripCoordinates(trip) +
            "\t\t\t\t</coordinates>\n" +
            "\t\t\t</LineString>\n" +
            "\t\t</Placemark>\n";
    }

    constructDescription = trip => {
        return `\t\t<name>${trip.title}</name>\n` +
            "\t\t<open>1</open>\n" +
            "\t\t<description>User KML Trip</description>\n";
    }

    constructStyle = () => {
        return "\t\t<Style id=\"CrossStyle\">\n" +
            "\t\t\t<LineStyle>\n" +
            "\t\t\t\t<color>ffffffb6</color>\n" +
            "\t\t\t\t<width>4</width>\n" +
            "\t\t\t</LineStyle>\n" +
            "\t\t</Style>\n";
    }

    constructKML = trip => {
        return this.constructHeader() +
            this.constructNamespace() +
            "\t<Document>\n" +
            this.constructDescription(trip) +
            this.constructStyle() +
            this.constructPlacemark(trip) +
            "\t</Document>\n" +
            "</kml>";
    }
}