import {EARTH_RADIUS_UNITS_DEFAULT, PROTOCOL_VERSION} from "../../utils/constants";
import Coordinates from "coordinate-parser";
import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as tripSchema from "../../../schemas/TripResponse.json";
import * as tripFileSchema from "../../../schemas/TripFile.json";

import {LOG} from '../../utils/constants';

export default class Trip {
    constructor() {
        this.requestVersion = PROTOCOL_VERSION;
        this.requestType = 'trip';
        this.options = {title: 'My Trip', earthRadius: '3959.0', units: "miles", response: "0.0"};
        this.places = [];
        this.distances = [];
    }

    async updateDistance() {
        sendServerRequest(this.constructRequestBody()).then(responseJSON => {
            if (responseJSON) this.processTripResponse(responseJSON);
        });
    }

    processTripResponse(responseJSON) {
        const responseBody = responseJSON.data;
        if (isJsonResponseValid(responseBody, tripSchema)) {
            LOG.info('setting distances');
            LOG.info(this.places);
            this.distances = responseBody.distances;
        }
    }

    constructRequestBody() {
        return {
            requestVersion: this.requestVersion,
            requestType: this.requestType,
            options: this.options,
            places: this.places
        }
    }

    addPlace(place) {
        return this.addPlaces([place]);
    }

    addPlaces(places) {
        if (!this.checkValidCoordinates(places))
            return this;

        const newTrip = this.copy();
        newTrip.places = this.places.concat(places);
        newTrip.updateDistance();
        return newTrip;
    }

    checkValidCoordinates(places) {
        try {
            places.forEach(place => {
                let coords = place.latitude + ' ' + place.longitude;
                new Coordinates(coords);
            })
            return true;
        } catch (error) {
            return false;
        }
    }

    removeAtIndex(index) {
        if (index < 0 || index >= this.places.length)
            return this;

        const newTrip = this.copy();
        newTrip.places.splice(index, 1);
        newTrip.updateDistance();
        return newTrip;
    }

    copy() {
        let newTrip = new Trip();
        newTrip.requestVersion = this.requestVersion;
        newTrip.requestType = this.requestType;
        newTrip.options = {title: this.title, earthRadius: this.earthRadius, units: this.units, response: this.response};
        newTrip.places = [];
        this.places.forEach(item => {
            newTrip.places.push(JSON.parse(JSON.stringify(item)));
        });
        newTrip.distances = this.distances;
        return newTrip;
    }

    setTitle(newTitle) {
        let newTrip = this.copy();
        newTrip.options.title = newTitle;
        return newTrip;
    }

    setUnits(unitName, earthRadius) {
        let newTrip = this.copy();
        newTrip.options.earthRadius = earthRadius;
        newTrip.options.units = unitName;
        return newTrip;
    }

    addNote(index, note) {
        if (this.places.length === 0 || index > this.places.length)
            return this;
        else {
            let newTrip = this.copy();
            newTrip.places[index].notes = note;
            return newTrip;
        }
    }

    loadJSON(tripFile) {
        if(!isJsonResponseValid(tripFile, tripFileSchema))
            return this;
        let newTrip = this.copy();

        for (const property in tripFile)
            newTrip[property] = tripFile[property];

        if (!tripFile.options.response)
            newTrip.options.response = "0.0";
        if (!tripFile.options.units)
            newTrip.options.units = this.selectUnitFromRadius(tripFile.options.earthRadius);

        return newTrip;
    }

    selectUnitFromRadius(radius) {
        const index = Object.values(EARTH_RADIUS_UNITS_DEFAULT).map(parseFloat).indexOf(parseFloat(radius));
        if (index === -1)
            return "miles";
        return Object.keys(EARTH_RADIUS_UNITS_DEFAULT)[index];
    }

    build() {
        return JSON.parse(JSON.stringify(this));
    }

    get title() {
        return this.options.title;
    }

    get earthRadius() {
        return this.options.earthRadius;
    }

    get units() {
        return this.options.units;
    }

    get response() {
        return this.options.response;
    }

    get totalDistance() {
        return this.distances.reduce((partial_sum, next) => partial_sum + next, 0);
    }

    get coordinatesList() {
        return this.places.map((place) => {
            const coordinate = new Coordinates(`${place.latitude}, ${place.longitude}`);
            return {lat: coordinate.getLatitude(), lng: coordinate.getLongitude()};
        });
    }

    get itineraryPlaceData() {
        let distancesAreCalculated = this.distances.length > 0;
        let cumulativeDist = 0;

        if (this.places.length === 0) {
            return [];
        }
        if (this.places.length === 1) {
            return [this.fullJSON(this.places[0], 0, 0, 0)];
        }

        let placesData = [];
        for (let i = 0; i <= this.places.length; i++) {
            const place = this.places[i % this.places.length];
            const legDist = (distancesAreCalculated && i > 0) ? this.distances[i - 1] : 0;
            cumulativeDist += legDist;

            placesData.push(this.fullJSON(place, legDist, cumulativeDist, i));
        }
        return placesData;
    }

    fullJSON(place, legDist, cumulativeDist, index) {
        return {
            "id": `destination-${index + 1}`,
            "name": place.name,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "municipality": place.municipality || "",
            "state": place.state || "",
            "country": place.country || "",
            "altitude": place.altitude || "",
            "notes": place.notes || "",
            "primary_text": this.primaryText(place),
            "location_text": this.locationText(place),
            "leg_dist": legDist,
            "cumulative_dist": cumulativeDist
        };
    }

    primaryText(place) {
        if (!place.name)
            return `(${parseFloat(place.latitude).toFixed(4)}, ${parseFloat(place.longitude).toFixed(4)})`;
        return place.name;
    }

    locationText(place) {
        const potentialItems = [place.municipality, place.state, place.country];
        let items = [];
        for (let i = 0; i < potentialItems.length; i++) {
            if (potentialItems[i] && items.length < 2)
                items.push(potentialItems[i]);
        }
        const MAX_LENGTH = 42;
        let result = items.join(", ");
        if (result.length > MAX_LENGTH)
            result = result.substring(0, MAX_LENGTH) + "...";

        return result;
    }

    // credit: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    downloadAsJson() {
        const fileName = this.title.replace(/ /g,"_").toLowerCase();
        const savedJSON = this.build();
        const fileData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedJSON, null, 2));
        const downloadNode = document.createElement('a');
        downloadNode.setAttribute("href", fileData);
        downloadNode.setAttribute("download", fileName + ".json");
        document.body.appendChild(downloadNode);
        downloadNode.click();
        downloadNode.remove();
    }

    optimize() {
        const newTrip = this.copy();
        newTrip.options.response = "1.0";
        return newTrip;
    }
}
