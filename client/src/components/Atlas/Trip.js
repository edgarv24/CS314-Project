import {PROTOCOL_VERSION} from "../../utils/constants";

export default class Trip {
    constructor() {
        this.requestVersion = PROTOCOL_VERSION;
        this.requestType = 'trip';
        this.options = {'title': 'My Trip', 'earthRadius': '3959.0'};
        this.places = [];
        this.distances = [];
    }

    get title() {
        return this.options.title;
    }

    get earthRadius() {
        return this.options.earthRadius;
    }

    addDestination(destination) {
        const newTrip = this.copy(this);
        newTrip.places = [...this.places, destination];
        return newTrip;
    }

    copy(prevTrip) {
        let newTrip = new Trip();
        newTrip.requestVersion = prevTrip.requestVersion;
        newTrip.requestType = prevTrip.requestType;
        newTrip.options = {title: prevTrip.title, earthRadius: prevTrip.options.earthRadius};
        newTrip.places = [];
        prevTrip.places.forEach(item => {
            newTrip.places.push(JSON.parse(JSON.stringify(item)));
        });
        newTrip.distances = prevTrip.distances;
        return newTrip;
    }

     setTitle(newTitle) {
        let newTrip = this.copy(this);
        newTrip.options.title = newTitle;
        return newTrip;
    }

    addNote(index, note) {
        if (this.places.length === 0 || index > this.places.length)
            return this;
        else {
            let newTrip = this.copy(this);
            newTrip.places[index].notes = note;
            return newTrip;
        }
    }

    setDistance(distances) {
        let newTrip = this.copy(this);
        newTrip.distances = distances;
        return newTrip;
    }

    loadJSON(tripFile) {
        let newTrip = this.copy(this);
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
}

