import {PROTOCOL_VERSION} from "../../utils/constants";
import Coordinates from "coordinate-parser";
import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as tripSchema from "../../../schemas/TripResponse.json"

export default class Trip {
    constructor() {
        this.requestVersion = PROTOCOL_VERSION;
        this.requestType = 'trip';
        this.options = {'title': 'My Trip', 'earthRadius': '3959.0'};
        this.places = [];
        this.distances = [];
    }

    addPlace(place) {
        return this.addPlaces([place]);
    }

    addPlaces(places) {
        if (!this.checkValidCoordinates(places))
            return this;

        const newTrip = this.copy();
        newTrip.places = this.places.concat(places);
        sendServerRequest(this.constructRequestBody(newTrip)).then(responseJSON => {
            if (responseJSON)
                    this.updateDistance(responseJSON, newTrip)
        });
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

    constructRequestBody(trip) {
        return {
            requestVersion: trip.requestVersion,
            requestType: trip.requestType,
            options: trip.options,
            places: trip.places,
        }
    }

    updateDistance(responseJSON, newTrip) {
        const responseBody = responseJSON.data;
        if (isJsonResponseValid(responseBody, tripSchema)) {
            newTrip.distances = responseBody.distances;
        }
    }

    removeAtIndex(index) {
        if (index < 0 || index >= this.places.length)
            return this;

        const newTrip = this.copy();
        newTrip.places.splice(index, 1);
        sendServerRequest(this.constructRequestBody(newTrip)).then(responseJSON => {
            if (responseJSON)
                this.updateDistance(responseJSON, newTrip)
        });
        return newTrip;
    }

    copy() {
        let newTrip = new Trip();
        newTrip.requestVersion = this.requestVersion;
        newTrip.requestType = this.requestType;
        newTrip.options = {title: this.title, earthRadius: this.options.earthRadius};
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

    setDistances(distances) {
        let newTrip = this.copy();
        newTrip.distances = distances;
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
        let newTrip = this.copy();
        newTrip.requestVersion = tripFile.requestVersion;
        newTrip.requestType = tripFile.requestVersion;
        newTrip.options = tripFile.options;
        newTrip.places = tripFile.places;
        newTrip.distances = tripFile.distances;
        return newTrip;
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

    get coordinatesList() {
        return this.places.map((place) => {
            const coordinate = new Coordinates(`${place.latitude}, ${place.longitude}`);
            return {lat: coordinate.getLatitude(), lng: coordinate.getLongitude()};
        });
    }

    get itineraryPlaceData() {
        let distancesAreCalculated = this.distances.length > 0;
        let cumulativeDist = 0;

        let placesData = [];
        for (let i = 0; i <= this.places.length; i++) {
            const place = this.places[i % this.places.length];
            const legDist = (distancesAreCalculated && index > 0) ? this.distances[index - 1] : 0;
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
            "leg_dist": legDist,
            "cumulative_dist": cumulativeDist
        };
    }
}

