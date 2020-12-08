import React from "react";
import {
    Button,
    Form,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    FormGroup
} from "reactstrap";
import {FormFeedback, Label} from "reactstrap";

import {renderModalTitleHeader, renderCancelButton} from "./modalHelper";

import coBrews from "../../../../test/TripFiles/co-brews.json";
import usBrews from "../../../../test/TripFiles/us-brews.json";
import worldBrews from "../../../../test/TripFiles/world-brews.json";
import worldPeaks from "../../../../test/TripFiles/world-peaks.json";
import Trip from "../Trip";
import {LOG, EARTH_RADIUS_UNITS_DEFAULT, capitalize} from "../../../utils/constants";

export default class TripSettingsModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            titleInput: "",
            invalidUploadText: null,
            selectedUnit: props.trip.units,
            selectedFormat: "JSON"
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({selectedUnit: nextProps.trip.units});
    }

    render() {
        return (
            <Modal id="trip-settings-modal" isOpen={this.props.isOpen} toggle={() => this.resetState()}>
                {renderModalTitleHeader("Trip Settings", () => this.resetState())}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        );
    }

    renderBody() {
        return (
            <ModalBody className="ml-3 mr-3">
                {this.renderTitleInput()}
                {this.renderUnitSelector()}
                {this.renderFileUpload()}
                {this.renderSave()}
                {this.renderLoadButtons()}
                {this.renderClearTripButton()}
            </ModalBody>
        );
    }

    renderTitleInput() {
        return (
            <div className="mt-1 mb-4">
                <Label for="settings-title-input">Title</Label>
                <Input id="settings-title-input" placeholder={this.props.trip.title} value={this.state.titleInput}
                       onChange={(e) => this.setState({titleInput: e.target.value})}/>
            </div>
        );
    }

    renderUnitSelector() {
        const unitOptions = Object.keys(EARTH_RADIUS_UNITS_DEFAULT);
        return (
            <Row className="mb-4">
                <Col>
                    <Label for="unit-selector">Units</Label>
                    <Input id="unit-selector" value={this.state.selectedUnit} type="select"
                           onChange={(e) => this.setState({selectedUnit: e.target.value})}>
                        {unitOptions.map(item => {
                            const itemName = capitalize(item);
                            return <option key={item} value={item}>{itemName}</option>
                        })}
                    </Input>
                </Col>
                <Col>
                    <Label for="radius-display">Earth Radius</Label>
                    <Input id="radius-display" value={EARTH_RADIUS_UNITS_DEFAULT[this.state.selectedUnit]} disabled/>
                </Col>
            </Row>
        );
    }

    renderSave() {
        const formats = ["JSON", "CSV", "KML", "SVG"];
        return (
            <Form>
                <FormGroup>
                    <Label for="download-menu">Save Trip</Label>
                    <Input id="download-menu" type="select"
                           onChange={e => this.setState({selectedFormat: e.target.value})}>
                        {formats.map((value, index) => <option id={index} key={index}>{value}</option>)}
                    </Input>
                    <Button className="mb-4" outline color="primary" block onClick={() => this.downloadSelectedFormat()}>
                        Download
                    </Button>
                </FormGroup>
            </Form>
        );
    }

    downloadSelectedFormat() {
        const format = this.state.selectedFormat;
        if (format === "JSON") this.props.trip.downloadAsJson();
        else if (format === "CSV") return; // add trip.downloadAsCsv
        else if (format === "KML") return; // add trip.downloadAsKml
        else if (format === "SVG") return; // add trip.downloadAsSvg
        else return;
    }

    renderFileUpload() {
        return (
            <div className="mb-4">
                <InputGroup>
                    <Label for="upload-trip-file">Upload Trip File</Label>
                    <Input id="upload-trip-file" type="file" accept=".json"
                           onChange={event => {
                               const loadedFiles = event.target.files;
                               if (loadedFiles.length > 0) this.processFile(loadedFiles[0]);
                           }}
                    />
                </InputGroup>
                {this.state.invalidUploadText &&
                <FormFeedback className="d-block">Error: {this.state.invalidUploadText}</FormFeedback>}
            </div>
        );
    }

    processFile(file) {
        LOG.info("File selected: " + file.name);

        const read = new FileReader();
        read.readAsText(file, "UTF-8");
        read.onloadend = event => {
            const contentString = event.target.result;
            try {
                const loadedData = JSON.parse(contentString);
                const newTrip = this.props.trip.loadJSON(loadedData);
                if (newTrip !== this.props.trip)
                    this.updateTrip(newTrip);
                else
                    this.setState({invalidUploadText: "File must match TripFile.json schema."});
            } catch (error) {
                this.setState({invalidUploadText: "Not a valid JSON file."});
            }
        }
    }

    renderLoadButtons() {
        return (
            <>
                <Label for="load-co-brews">Load Class Datasets</Label>
                <div className="mt-1 mb-2">
                    {this.renderLoadButton("load-co-brews", "Colorado Brews", coBrews)}
                    {this.renderLoadButton("load-us-brews", "United States Brews", usBrews)}
                </div>
                <div className="mb-4">
                    {this.renderLoadButton("load-world-brews", "World Brews", worldBrews)}
                    {this.renderLoadButton("load-world-peaks", "World Peaks", worldPeaks)}
                </div>
            </>
        );
    }

    renderLoadButton(id, name, tripFile) {
        return (
            <Button id={id} className="mr-2" size="sm" color="secondary" outline
                    onClick={() => this.updateTrip(this.props.trip.loadJSON(tripFile))}>
                {name}
            </Button>
        );
    };

    renderClearTripButton() {
        return (
            <div className="mt-1">
                <Label for="clear-trip-button">Delete Trip</Label>
                <Button id="clear-trip-button" className="mb-2 float-right" size="sm" color="danger" outline block
                        onClick={() => this.updateTrip(new Trip())}>
                    Clear Trip Data
                </Button>
            </div>
        );
    }

    renderFooter() {
        return (
            <ModalFooter>
                <Button id="trip-settings-submit" color="primary" type="button"
                        onClick={() => {
                            this.props.setTrip(this.getUpdatedTripFromChanges());
                            this.resetState();
                        }}>
                    Save Settings
                </Button>
                {renderCancelButton("close-trip-settings", () => this.resetState())}
            </ModalFooter>
        );
    }

    getUpdatedTripFromChanges() {
        const trip = this.props.trip;
        const newTitle = this.state.titleInput;
        const newUnitName = this.state.selectedUnit;
        const newUnitValue = EARTH_RADIUS_UNITS_DEFAULT[this.state.selectedUnit];

        const titleChanged = newTitle.length > 0;
        const unitChanged = trip.units !== newUnitName || trip.earthRadius !== newUnitValue;

        let newTrip = trip;
        if (titleChanged)
            newTrip = newTrip.setTitle(newTitle);
        if (unitChanged)
            newTrip = newTrip.setUnits(newUnitName, newUnitValue);

        if (newTrip !== trip)
            return newTrip;
        return trip;
    }

    updateTrip(newTrip) {
        this.props.setTrip(newTrip);
        this.props.resetTable();
        this.resetState();
    }

    resetState() {
        this.setState({titleInput: "", invalidUploadText: null});
        this.props.toggleOpen();
    };
}