import React from "react";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, Row, Col} from "reactstrap";
import {renderModalTitleHeader, renderCancelButton} from "./modalHelper";
import {getCoordinateOrNull} from "../../../utils/constants";

export default class DestinationModal extends React.Component {
    constructor(props) {
        super(props);

        const data = this.props.placeData;

        let coordinates = data.coordinates;
        if (!coordinates) coordinates =
            (data.latitude && data.longitude)
            ? `${data.latitude}, ${data.longitude}`
            : '';

        this.state = {
            name: data.name || '',
            coordinates: coordinates,
            municipality: data.municipality || '',
            region: data.region || data.state || '',
            country: data.country || '',
            altitude: data.altitude || '',
            notes: data.notes || ''
        };
    }

    render() {
        return (
            <Modal id="destination-modal" isOpen={this.props.isOpen} toggle={() => this.resetState()}>
                {renderModalTitleHeader("Destination Details", () => this.resetState())}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        );
    }

    renderBody() {
        return (
            <ModalBody className="ml-3 mr-3">
                {this.renderInput('destination-name', 'Name', this.state.name, 'text',
                    (e) => this.setState({name: e.target.value}))}
                {this.renderSecondRow()}
                {this.renderThirdRow()}
                {this.renderInput('destination-notes', 'Notes', this.state.notes, 'textarea',
                    (e) => this.setState({notes: e.target.value}))}
            </ModalBody>
        );
    }

    renderSecondRow() {
        return (
            <Row>
                <Col xs={7}>
                    {this.renderInput('destination-coordinates', 'Coordinates', this.state.coordinates, 'text',
                        (e) => this.setState({coordinates: e.target.value}),
                        getCoordinateOrNull(this.state.coordinates) === null)}
                </Col>
                <Col xs={5}>
                    {this.renderInput('destination-altitude', 'Altitude (feet)', this.state.altitude, 'text',
                        (e) => this.setState({altitude: e.target.value}))}
                </Col>
            </Row>
        );
    }

    renderThirdRow() {
        return (
            <Row>
                <Col>
                    {this.renderInput('destination-country', 'Country', this.state.country, 'text',
                        (e) => this.setState({country: e.target.value}))}
                </Col>
                <Col>
                    {this.renderInput('destination-region', 'Region', this.state.region, 'text',
                        (e) => this.setState({region: e.target.value}))}
                </Col>
                <Col>
                    {this.renderInput('destination-municipality', 'Municipality', this.state.municipality, 'text',
                        (e) => this.setState({municipality: e.target.value}))}
                </Col>
            </Row>
        );
    }

    renderInput(id, label, value, type, onChange, invalid=false) {
        return (
            <div className="mt-1 mb-4">
                <Label for={id}>{label}</Label>
                <Input id={id} value={value} type={type} onChange={onChange} invalid={invalid}/>
            </div>
        );
    }

    renderFooter() {
        return (
            <ModalFooter>
                <Button id="destination-submit-button" color="primary" type="button"
                        disabled={getCoordinateOrNull(this.state.coordinates) === null}
                        onClick={() => {
                            const trip = this.props.trip;
                            const index = this.props.placeIndex;
                            const data = this.buildDataFromForm();

                            if (index === -1) this.updateTrip(trip.addPlace(data));
                            else this.updateTrip(this.props.trip.editAtIndex(index, data));
                        }}>
                    {this.props.placeIndex >= 0 ? 'Save' : 'Add to Trip'}
                </Button>
                {renderCancelButton("destination-close-button", () => this.resetState())}
            </ModalFooter>
        );
    }

    buildDataFromForm() {
        const coordinate = getCoordinateOrNull(this.state.coordinates);
        const newPlaceData = {
            name: this.state.name,
            latitude: coordinate.getLatitude().toString(),
            longitude: coordinate.getLongitude().toString()
        };

        // add optional parameters if fields are non-empty
        const {coordinates, municipality, region, country, altitude, notes} = this.state;
        coordinates && (newPlaceData.coordinates = coordinates);
        municipality && (newPlaceData.municipality = municipality);
        region && (newPlaceData.region = region);
        country && (newPlaceData.country = country);
        altitude && (newPlaceData.altitude = altitude);
        notes && (newPlaceData.notes = notes);

        if (this.props.placeIndex === -1)
            return newPlaceData;

        return {...this.props.trip.places[this.props.placeIndex], ...newPlaceData};
    }

    updateTrip(newTrip) {
        this.props.setTrip(newTrip);
        this.resetState();
    }

    resetState() {
        // this.setState({name: ""});
        this.props.toggleOpen();
    };
}