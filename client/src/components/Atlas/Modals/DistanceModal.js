import React, {Component} from 'react';
import {
    Button,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from 'reactstrap';

import {isJsonResponseValid, sendServerRequest} from "../../../utils/restfulAPI";
import * as distanceSchema from "../../../../schemas/DistanceResponse.json";

import Coordinates from "coordinate-parser";
import {PROTOCOL_VERSION} from "../../../utils/constants";

const BOX_INPUT1 = 0;
const BOX_INPUT2 = 1;

export default class DistanceModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputValues: [this.props.input1, this.props.input2],      // strings from 2 input boxes
            coordinatePairs: [null, null],              // converted coordinates from 2 input boxes
            calculatedDistance: 0
        };
    }

    componentDidMount() {
        this.updateInputValueAndAttemptConvert(BOX_INPUT1, this.state.inputValues[BOX_INPUT1]);
        this.updateInputValueAndAttemptConvert(BOX_INPUT2, this.state.inputValues[BOX_INPUT2]);
        this.requestDistanceFromServer();
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader className="mt-1" toggle={() => this.props.toggleOpen()}>
                        <span className="ml-4">Distance Between Coordinates</span>
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            {this.renderCoordinateInput(BOX_INPUT1)}
                            {this.renderCoordinateInput(BOX_INPUT2)}
                        </div>
                    </ModalBody>
                    {this.renderActionButtons()}
                </Modal>
            </div>
        );
    }

    renderCoordinateInput(index) {
        const validCoordinate = this.state.coordinatePairs[index] != null;
        const inputBoxEmpty = this.state.inputValues[index] === "" || this.state.inputValues[index] == null;

        return (
            <Row className="ml-2 mr-2 mt-3 mb-4">
                <Col>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">{`Point ${index + 1}`}</InputGroupAddon>
                        <Input placeholder="Latitude, Longitude"
                               onChange={(e) => {
                                   this.updateInputValueAndAttemptConvert(index, e.target.value);
                                   this.requestDistanceFromServer();
                               }}
                               value={this.state.inputValues[index] || ""}
                               valid={validCoordinate}
                               invalid={!inputBoxEmpty && !validCoordinate}
                        />
                    </InputGroup>
                </Col>
            </Row>
        );
    }

    renderActionButtons() {
        return (
            <ModalFooter>
                <Button className="mr-2" color='primary' onClick={() => this.resetModalState()}>Cancel</Button>
                <Button color='primary' onClick={() => {
                    this.props.processDistanceRequestSuccess(this.state.coordinatePairs[BOX_INPUT1],
                        this.state.coordinatePairs[BOX_INPUT2], this.state.calculatedDistance);
                    this.resetModalState();
                }}
                        disabled={this.state.calculatedDistance == null || !this.checkValidCoordinates()}
                >
                    Submit
                </Button>
            </ModalFooter>
        );
    }

    updateInputValueAndAttemptConvert(index, newInputString) {
        let newInputValues = this.state.inputValues;
        let newCoordinates = this.state.coordinatePairs;

        if (this.isValidCoordinate(newInputString)) {
            const coordinate = new Coordinates(newInputString);
            newCoordinates[index] = {lat: coordinate.getLatitude(), lng: coordinate.getLongitude()};
        } else {
            newCoordinates[index] = null;
        }

        newInputValues[index] = newInputString;
        this.setState({ inputValues: newInputValues, coordinatePairs: newCoordinates });
    }

    isValidCoordinate(position) {
        try {
            new Coordinates(position);
            return true;
        } catch (error) {
            return false;
        }
    };

    checkValidCoordinates(coordinates = this.state.coordinatePairs) {
        return coordinates[BOX_INPUT1] != null && coordinates[BOX_INPUT2] != null;
    }

    requestDistanceFromServer(earthRadius = 3959.0) {
        if (this.checkValidCoordinates()) {
            sendServerRequest(this.constructRequestBody(this.state.coordinatePairs, earthRadius))
                .then(responseJSON => {
                    if (responseJSON) {
                        this.processDistanceResponse(responseJSON)
                    } else {
                        this.setState({calculatedDistance: null});
                    }
                });
        } else {
            this.setState({calculatedDistance: null});
        }
    }

    constructRequestBody(coordinates, earthRadius) {
        // coordinates is array of 2 latLng objects
        return {
            requestVersion: PROTOCOL_VERSION,
            requestType: "distance",
            place1: this.latLngToStringPair(coordinates[BOX_INPUT1]),
            place2: this.latLngToStringPair(coordinates[BOX_INPUT2]),
            earthRadius: earthRadius,
            distance: 0
        }
    }

    latLngToStringPair(latLng) {
        // turn latLng object into format needed for JSON schema for server requests
        return {
            latitude: latLng["lat"].toString(),
            longitude: latLng["lng"].toString()
        };
    }

    processDistanceResponse(responseJSON) {
        const responseBody = responseJSON.data;
        if (isJsonResponseValid(responseBody, distanceSchema)) {
            this.setState({calculatedDistance: responseBody.distance});
        } else {
            this.setState({coordinatePairs: [null, null]});
        }
    }

    resetModalState() {
        this.props.toggleOpen();
        this.setState({
            inputValues: [null, null],
            coordinatePairs: [null, null],
            calculatedDistance: null
        });
    }
}