import React from "react";
import {Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody, ModalFooter, Row, Col} from "reactstrap";

import {renderModalTitleHeader, renderCancelButton} from "./modalHelper";

import coBrews from "../../../../test/TripFiles/co-brews.json";
import usBrews from "../../../../test/TripFiles/us-brews.json";
import worldBrews from "../../../../test/TripFiles/world-brews.json";

export default class TripSettingsModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            titleInput: ""
        };
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={() => this.resetState()}>
                {renderModalTitleHeader("Trip Settings", () => this.resetState())}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        );
    }

    renderBody() {
        return (
            <ModalBody>
                {this.renderInputRow(
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Trip Title</InputGroupAddon>
                        <Input placeholder={this.props.trip.title} value={this.state.titleInput}
                               onChange={(e) => this.setState({titleInput: e.target.value})} />
                    </InputGroup>)}
                {this.renderInputRow(
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Unit</InputGroupAddon>
                        <Input type="select">
                            <option>Miles (Earth radius = 3959.0)</option>
                        </Input>
                    </InputGroup>)}
                {this.renderInputRow(
                    <>
                        {this.renderLoadButton("Load CO-Brews", coBrews)}
                        {this.renderLoadButton("Load US-Brews", usBrews)}
                        {this.renderLoadButton("Load World-Brews", worldBrews)}
                    </>
                )}
            </ModalBody>
        );
    }

    renderFooter() {
        return (
            <ModalFooter>
                <Button id="trip-settings-submit" color="primary" type="button"
                        onClick={() => {
                            if (this.state.titleInput.length > 0)
                                this.props.setTrip(this.props.trip.setTitle(this.state.titleInput));
                            this.resetState();
                        }}>
                    Save Settings
                </Button>
                {renderCancelButton("close-trip-settings", () => this.resetState())}
            </ModalFooter>
        );
    }

    renderInputRow(input) {
        return (
            <Row className="ml-2 mr-2 mt-3 mb-4">
                <Col>
                    {input}
                </Col>
            </Row>
        );
    };

    renderLoadButton(name, tripFile) {
        return (
            <Button id={`load-${name}`} className="mr-3 mb-3" size="sm" color="primary" type="button" outline onClick={() => {
                const newTrip = this.props.trip.loadJSON(tripFile);
                this.props.setTrip(newTrip);
                this.props.updatePlaceData();
                this.resetState()
            }}>
                {name}
            </Button>
        );
    };

    resetState() {
        this.setState({titleInput: ""});
        this.props.toggleOpen();
    };
}