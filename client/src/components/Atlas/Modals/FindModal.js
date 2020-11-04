import React, {Component} from 'react';
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';

import {ListItem, ListItemText, ListSubheader} from "@material-ui/core";

import {isJsonResponseValid, sendServerRequest} from "../../../utils/restfulAPI";
import * as findSchema from "../../../../schemas/FindResponse.json";
import {PROTOCOL_VERSION} from "../../../utils/constants";

import {hasFlag} from 'country-flag-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

const RESPONSE_LIMIT = 20;
const TYPING_REQUEST_DELAY = 1000;

export default class FindModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            places: [],
            found: 0,
            inputText: "",
            selectedPlace: null
        };
    }

    componentDidMount() {
        this.timer = null;
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                <ModalHeader className="mt-1" toggle={() => this.props.toggleOpen()}>
                    <span className="ml-4">Find Places</span>
                </ModalHeader>
                <ModalBody>
                    {this.renderInputBox()}
                    {this.renderList()}
                </ModalBody>
                {this.renderFooter()}
            </Modal>
        );
    }

    renderInputBox() {
        return (
            <div className="ml-3 mr-3 mb-3 mt-3">
                <InputGroup >
                    <InputGroupAddon addonType="prepend">{`Name`}</InputGroupAddon>
                    <Input placeholder="Enter place"
                           onChange={event => this.onInputChange(event.target.value)}
                           value={this.state.inputText || ""}
                    />
                </InputGroup>
            </div>
        );
    }

    onInputChange(newValue) {
        clearTimeout(this.timer);
        if (newValue) {
            this.setState({inputText: newValue });
            this.timer = setTimeout(
                () => this.requestFindFromServer(newValue),
                TYPING_REQUEST_DELAY);
        }
        else {
            this.setState({inputText: newValue, places: [], selectedPlace: null });
        }
    }

    renderList() {
        const HEADING = (this.state.places.length > 0)
            ? `Matching results (showing ${this.state.places.length} of ${this.state.found})`
            : 'No matching airports.';
        return (
            <>
                <ListSubheader color='primary'>
                    {HEADING}
                </ListSubheader>
                <div style={{'maxHeight': '30vh', 'overflowY': 'auto'}}>
                    {this.renderListItems()}
                </div>
            </>
        );
    }

    renderListItems() {
        return (
            this.state.places.map((item, index) =>
                <ListItem
                    button
                    divider
                    key={item.name + '-' + index}
                    selected={item === this.state.selectedPlace}
                    onClick={() => this.setState({selectedPlace: item})}
                >
                    <ListItemText
                        primary={this.getAirportText(item)}
                        secondary={this.getLocationText(item)}
                    />
                </ListItem>
            )
        );
    }

    getAirportText(item) {
        const flag = hasFlag(item.country_id) ? getUnicodeFlagIcon(item.country_id) + ' ' : '';
        return `${flag}${item.name} - [${item.id}]`;
    }

    getLocationText(item) {
        const start = [item.municipality, item.region].filter(it => it != null && it !== '(unassigned)').join(', ')
        const middle = (start.length > 0) ? ' ' : '';
        const end = `(${item.country})`;
        return start + middle + end;
    }

    renderFooter() {
        return (
            <ModalFooter>
                {this.renderLocateButton()}
                <Button className="mr-2" color='primary' onClick={() => this.resetModalState()}>Cancel</Button>
            </ModalFooter>
        );
    }

    renderLocateButton(){
        return(
            <Button
                id="locate-button"
                className="mr-2" color='primary'
                disabled={!this.state.selectedPlace}
                onClick={() => {
                    this.props.processFindRequestViewLocation(this.getSelectedPlaceLatLng());
                    this.resetModalState();
                }}
            >
                Locate
            </Button>
        );
    }

    getSelectedPlaceLatLng() {
        const latitude = parseInt(this.state.selectedPlace.latitude);
        const longitude = parseInt(this.state.selectedPlace.longitude);
        return {lat: latitude, lng: longitude};
    }

    resetModalState() {
        this.props.toggleOpen();
        this.setState({
            places: [],
            found: 0,
            inputText: null,
            selectedPlace: null
        });
    }

    requestFindFromServer(placeName) {
        sendServerRequest(this.constructRequestBody(placeName))
            .then(responseJSON => {
                if (responseJSON) {
                    this.processFindResponse(responseJSON)
                }
            }
        );
    }

    constructRequestBody(placeName) {
        return {
            requestVersion: PROTOCOL_VERSION,
            requestType: "find",
            match: placeName,
            limit: RESPONSE_LIMIT,
        }
    }

    processFindResponse(responseJSON) {
        const responseBody = responseJSON.data;
        if (isJsonResponseValid(responseBody, findSchema)) {
            // Only update results if the response correlates with what is currently in the input box.
            // Otherwise, places gets updated with every letter typed, even when the user isn't finished (looks laggy).
            // It would be better to cancel the unneeded requests, but this is a workaround for now.
            if (responseBody.match === this.state.inputText)
                this.setState({places: responseBody.places, found: responseBody.found, selectedPlace: null});
        } else {
            this.setState({places: [], found: 0, selectedPlace: null});
        }
    }
}