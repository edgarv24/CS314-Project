import React from "react";
import {Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody, ModalHeader, ModalFooter, Row, Col} from "reactstrap";

import coBrews from "../../../test/TripFiles/co-brews.json"
import usBrews from "../../../test/TripFiles/us-brews.json";
import worldBrews from "../../../test/TripFiles/world-brews.json";

export function TripSettingsModal({trip, setTrip, updatePlaceData, isOpen, toggleOpen}) {
    const [titleInput, setTitleInput] = React.useState(trip.title);
    const [realTitle, setRealTitle] = React.useState(trip.title);

    const resetState = () => {
        setTitleInput(realTitle);
        toggleOpen();
    };

    const inputRow = (input) => {
        return (
            <Row className="ml-2 mr-2 mt-3 mb-4">
                <Col>
                    {input}
                </Col>
            </Row>
        );
    };

    const loadButton = (name, tripFile) => {
        return (
            <Button id={`load-${name}`} className="mr-3 mb-3" size="sm" color="primary" type="button" outline onClick={() => {
                setTrip(trip.loadJSON(tripFile));
                updatePlaceData();
                resetState()
            }}>
                {name}
            </Button>
        );
    };

    return (
        <Modal isOpen={isOpen} toggle={() => {
            toggleOpen();
            resetState()
        }}>
            <ModalHeader className="mt-1" toggle={() => {
                toggleOpen();
                resetState()
            }}>
                <span className="ml-4">Trip Settings</span>
            </ModalHeader>
            <ModalBody>
                {inputRow(
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Trip Title</InputGroupAddon>
                        <Input placeholder={trip.title} value={titleInput} invalid={titleInput.length === 0}
                               onChange={(e) => setTitleInput(e.target.value)}/>
                    </InputGroup>)}
                {inputRow(
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">Unit</InputGroupAddon>
                        <Input type="select">
                            <option>Miles (Earth radius = 3959.0)</option>
                        </Input>
                    </InputGroup>)}
                {inputRow(
                    <>
                        {loadButton("Load CO-Brews", coBrews)}
                        {loadButton("Load US-Brews", usBrews)}
                        {loadButton("Load World-Brews", worldBrews)}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button id="trip-settings-close" color="primary" type="button" onClick={() => {resetState()}}>
                    Close
                </Button>
                <Button id="trip-settings-submit" color="primary" type="button" disabled={titleInput.length === 0}
                        onClick={() => {
                            setTrip(trip.setTitle(titleInput));
                            setRealTitle(titleInput);
                            resetState();
                        }}>
                    Save Settings
                </Button>
            </ModalFooter>
        </Modal>
    );
}