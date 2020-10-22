import {PROTOCOL_VERSION} from "../../utils/constants";
import Coordinates from "coordinate-parser";
import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as tripSchema from "../../../schemas/TripResponse.json";
import * as tripFileSchema from "../../../schemas/TripFile.json";

const DEFAULT_TRIP_TITLE = 'My Trip';
const EARTH_RADIUS = '3959.0'

export default class Trip {
    constructor() {
        this.requestVersion = PROTOCOL_VERSION;
        this.requestType = 'trip';
        this.options = {'title': DEFAULT_TRIP_TITLE, 'earthRadius': EARTH_RADIUS};
        this.places = [];
        this.distances = [];
    }

    updateDistance(onFinish=() => undefined) {
        sendServerRequest(this.constructRequestBody()).then(responseJSON => {
            if (responseJSON) {
                const responseBody = responseJSON.data;
                if (isJsonResponseValid(responseBody, tripSchema))
                    this.distances = responseBody.distances;
            }
        });
    }

    constructRequestBody() {
        return {
            requestVersion: this.requestVersion,
            requestType: this.requestType,
            options: this.options,
            places: this.places,
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
        if(!isJsonResponseValid(tripFile, tripFileSchema))
            return this;
        let newTrip = this.copy();

        for (const property in tripFile)
            newTrip[property] = tripFile[property];

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
        if (!place.name || place.name.length === 0)
            return `(${place.latitude}, ${place.longitude})`;
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
}
