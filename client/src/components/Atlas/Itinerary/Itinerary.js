import React from "react";
import {Button, Container} from "reactstrap";
import {IconButton, Paper, Tooltip, Zoom} from '@material-ui/core';
import FlightIcon from "@material-ui/icons/Flight";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import {DestinationTable} from "./DestinationTable";
import TripSettingsModal from '../Modals/TripSettingsModal';

export default class Itinerary extends React.Component {
    constructor(props) {
        super(props);

        this.updatePlaceDataOnServerRequestComplete = this.updatePlaceDataOnServerRequestComplete.bind(this);

        this.state = {
            placeData: this.props.trip.itineraryPlaceData,
            settingsModalOpen: false
        };
    }

    updatePlaceDataOnServerRequestComplete() {
        // Send new server request in Trip to make sure values are updated.
        // When the asynchronous request finishes, the callback will update
        // placeData here and also re-render this component.
        this.props.trip.updateDistance(() => {
            const newPlaceData = this.props.trip.itineraryPlaceData;
            this.setState({placeData: newPlaceData});
        });
    }

    render() {
        return (
            <Paper id="itinerary" elevation={3}>
                {this.renderHeader()}
                <hr style={{borderWidth: "2px", marginBottom: 0}}/>
                <DestinationTable data={this.state.placeData}/>
                <TripSettingsModal
                    trip={this.props.trip}
                    setTrip={this.props.setTrip}
                    isOpen={this.state.settingsModalOpen}
                    updatePlaceData={this.updatePlaceDataOnServerRequestComplete}
                    toggleOpen={(isOpen = !this.state.settingsModalOpen) => this.setState({settingsModalOpen: isOpen})}/>
            </Paper>
        );
    }

    renderHeader() {
        return (
            <Container className="m-2 pt-4">
                <h4 className="d-inline"><FlightIcon/> <strong>{this.props.trip.title}</strong></h4>
                <h6 className="mt-3"><strong>Total Distance:</strong> {this.getDistanceLabelText()}</h6>
                {this.renderButtons()}
            </Container>
        );
    }

    renderButtons() {
        return (
            <div className="mt-3">
                <Button id="trip-settings-button" outline size="sm" color="primary"
                        onClick={() => this.setState({settingsModalOpen: true})}>
                    Trip Settings
                </Button>
                <Button id="add-destination-button" outline className="ml-3" size="sm" color="primary"
                        onClick={() => undefined} disabled={true}>
                    Add Destination
                </Button>
                {this.renderScrollUpButton()}
            </div>
        );
    }

    renderScrollUpButton() {
        return (
            <Tooltip title="Map" placement="left" TransitionComponent={Zoom} arrow>
                <Paper className="float-right" elevation={1}>
                    <IconButton id="scroll-up-button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                                size="small" color="inherit">
                        <ArrowUpwardIcon/>
                    </IconButton>
                </Paper>
            </Tooltip>
        );
    }

    getDistanceLabelText() {
        const distances = this.props.trip.distances;
        if (distances.length === 0)
            return "N/A";

        const sum = distances.reduce((partial_sum, next) => partial_sum + next, 0);
        const plural = (sum === 1) ? "" : "s";
        const units = "mile";

        return `${sum} ${units}${plural}`;
    }
}