import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';

import {renderModalTitleHeader, renderCancelButton} from "./modalHelper";
import {ListItem, ListItemText, ListSubheader} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import {isJsonResponseValid, sendServerRequest} from "../../../utils/restfulAPI";
import * as findSchema from "../../../../schemas/FindResponse.json";
import {PROTOCOL_VERSION} from "../../../utils/constants";
import {getFlagIcon} from "../../../utils/constants";

const RESPONSE_LIMIT = 20;
const TYPING_REQUEST_DELAY = 1000;

export default class FindModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            places: [],
            filters: {},
            found: 0,
            inputText: "",
            selectedPlace: null,
            selectedCountry: null,
            selectedAirportType: null
        };
    }

    componentDidMount() {
        this.timer = null;
    }

    render() {
        if (Object.keys(this.state.filters).length === 0) this.requestConfigFromServer();
        return (
            <Modal id="find-modal" isOpen={this.props.isOpen} toggle={() => this.resetModalState()}>
                {renderModalTitleHeader("Find Places", () => this.resetModalState())}
                <ModalBody>
                    {this.renderComboBox()}
                    {this.renderAirportTypeBox()}
                    {this.renderInputBox()}
                    {this.renderList()}
                </ModalBody>
                {this.renderFooter()}
            </Modal>
        );
    }

    renderComboBox() {
        return (
            <div className="ml-3 mr-3 mb-3 mt-3">
                <Autocomplete
                    id="combo-box"
                    fullWidth={true}
                    size="small"
                    options={this.state.filters.where || []}
                    onChange={(event, country) => {
                        this.setState({selectedCountry: country});
                        this.onInputChange(this.state.inputText);
                    }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label="Filter by Country" variant="outlined"/>}/>
            </div>
        )
    }

    renderAirportTypeBox(){
        return(
            <div className="ml-3 mr-3 mb-3 mt-4">
                <Autocomplete
                    id="airport-type-box"
                    fullWidth={true}
                    size="small"
                    options={this.state.filters.type || []}
                    onChange={(event, airportType) => {
                        this.setState({selectedAirportType: airportType });
                        this.onInputChange(this.state.inputText);
                    }}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label="Filter by Airport Type" variant="outlined"/>}/>
            </div>
        );
    }

    renderInputBox() {
        return (
            <div className="ml-3 mr-3 mb-3 mt-4">
                <TextField id="place-name-input" label="Place Name" variant="outlined"
                           onChange={e => this.onInputChange(e.target.value)}
                           value={this.state.inputText || ""}
                           fullWidth={true}
                           size="small"
                />
            </div>
        );
    }

    onInputChange(newValue) {
        clearTimeout(this.timer);
        if (newValue) {
            this.setState({inputText: newValue});
            this.timer = setTimeout(
                () => this.requestFindFromServer(newValue),
                TYPING_REQUEST_DELAY);
        } else {
            this.setState({inputText: newValue, places: [], selectedPlace: null});
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
        const flag = getFlagIcon(item.country_id);
        const flagText = flag ? flag + " " : "";
        return `${flagText}${item.name} - [${item.id}]`;
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
                {this.renderActionButton("locate-button", "Locate",
                    () => this.props.processFindRequestViewLocation(this.getSelectedPlaceLatLng()))}
                {this.renderActionButton("add-to-trip-button", "Add to Trip",
                    () => this.props.processFindRequestAddToTrip(this.state.selectedPlace))}
                {renderCancelButton("close-find-modal", () => this.resetModalState())}
            </ModalFooter>
        );
    }

    renderActionButton(id, name, action) {
        return (
            <Button id={id} className="mr-2" color="primary" disabled={!this.state.selectedPlace}
                    onClick={() => {
                        action();
                        this.resetModalState();
                    }}
            >
                {name}
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
            filters: {},
            found: 0,
            inputText: null,
            selectedPlace: null
        });
    }

    requestFindFromServer(placeName) {
        sendServerRequest(this.constructRequestBody(placeName))
            .then(responseJSON => {
                if (responseJSON) this.processFindResponse(responseJSON);
            });
    }

    requestConfigFromServer() {
        sendServerRequest({requestType: "config"})
            .then(responseJSON => {
                if (responseJSON)
                    this.setState({filters: responseJSON.data.filters});
            })
    }

    constructRequestBody(placeName) {
        let request = {
            requestVersion: PROTOCOL_VERSION,
            requestType: "find",
            match: placeName,
            limit: RESPONSE_LIMIT
        }

        if (this.state.selectedCountry && this.state.selectedAirportType)
            request.narrow = {type: [this.state.selectedAirportType], where: [this.state.selectedCountry]};
        else if (this.state.selectedAirportType)
            request.narrow = {type: [this.state.selectedAirportType]};
        else if (this.state.selectedCountry)
            request.narrow = {where: [this.state.selectedCountry]};

        return request;
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
            this.setState({places: [], found: 0, selectedPlace: null, selectedCountry: null, selectedAirportType: null});
        }
    }
}