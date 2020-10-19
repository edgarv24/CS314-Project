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

    addDestination(destination) {
        const newTrip = this.copy(this);
        newTrip.places = [...this.places, destination];
        return newTrip;
    }

    copy(prevTrip) {
        //let newTrip = JSON.parse(JSON.stringify(prevTrip));
        let newTrip = new Trip();
        newTrip.requestVersion = prevTrip.requestVersion;
        newTrip.requestType = prevTrip.requestType;
        newTrip.options = prevTrip.options;
        newTrip.places = prevTrip.places;
        newTrip.distances = prevTrip.distances;
        return newTrip;
    }

     setTitle(newTitle) {
        let newTrip = this.copy(this);
        newTrip.options.title = newTitle;
        return newTrip;
    }

    addNote(place, note) {
        if (this.places.length === 0)
            return this;
        else {
            let newTrip = this.copy(this);
            newTrip.places[place].notes = note;
            return newTrip;
        }
    }
}

