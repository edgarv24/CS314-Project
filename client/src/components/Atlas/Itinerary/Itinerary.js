import React, {createRef} from "react";
import {Button, Container} from "reactstrap";
import {IconButton, Paper, Tooltip, Zoom} from '@material-ui/core';
import FlightIcon from "@material-ui/icons/Flight";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import {DestinationTable} from "./DestinationTable";
import TripSettingsModal from '../Modals/TripSettingsModal';

import {correctUnits, LOG} from '../../../utils/constants';

export default class Itinerary extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = createRef();

        this.state = {
            placeData: [],
            settingsModalOpen: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const newPlaceData = nextProps.trip.itineraryPlaceData;
        this.setState({placeData: newPlaceData});
    }

    render() {
        return (
            <Paper id="itinerary" elevation={3}>
                {this.renderHeader()}
                <hr style={{borderWidth: "2px", marginBottom: 0}}/>
                <DestinationTable
                    ref={this.tableRef}
                    trip={this.props.trip}
                    setTrip={this.props.setTrip}
                    editPlace={this.props.editPlace}
                    units={this.props.trip.units}
                    data={this.state.placeData}/>
                <TripSettingsModal
                    trip={this.props.trip}
                    setTrip={this.props.setTrip}
                    isOpen={this.state.settingsModalOpen}
                    resetTable={() => this.tableRef.current.resetState()}
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
                        onClick={() => this.props.editPlace(-1, false)}>
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
        const distance = this.props.trip.totalDistance;
        const units = this.props.trip.units;

        if (distance === 0 && this.props.trip.places.length === 0)
            return "N/A";
        return `${distance} ${correctUnits(units, distance)}`;
    }
}