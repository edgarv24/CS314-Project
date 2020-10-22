import React from "react";
import {Button, Container} from "reactstrap";

import {Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow} from '@material-ui/core';
import {IconButton, ListItemText, Paper, Tooltip, Zoom} from '@material-ui/core';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import FlightIcon from "@material-ui/icons/Flight";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

export default class Itinerary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placeData: this.props.trip.itineraryPlaceData
        };
    }

    componentDidMount() {
        this.updatePlaceDataOnServerRequestComplete();
    }

    updatePlaceDataOnServerRequestComplete() {
        // Send new server request in Trip to make sure values are updated.
        // When the asynchronous request finishes, the callback will update
        // placeData here and also re-render this component.
        // this.props.trip.sendTripServerRequest(this.props.trip, () => {
        //     const newPlaceData = this.props.trip.itineraryPlaceData;
        //     this.setState({placeData: newPlaceData});
        // });
    }

    render() {
        return (
            <Paper elevation={3}>
                {this.renderHeader()}
                <hr style={{borderWidth: "2px", marginBottom: 0}}/>
                <DestinationTable data={this.state.placeData}/>
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
                <Button id="trip-settings-button" outline size="sm" color="primary" onClick={() => undefined}>
                    Trip Settings
                </Button>
                <Button id="add-destination-button" outline className="ml-3" size="sm" color="primary"
                        onClick={() => undefined}>
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

export const DestinationTable = ({data}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const realIndex = (index) => {
        return index + rowsPerPage * page;
    };

    const rowData = (index) => {
        return data[realIndex(index)];
    };

    const calculateRowsToRender = () => {
        return (rowsPerPage > 0)
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data;
    };

    const renderBody = () => {
        return (
            <TableBody>
                {calculateRowsToRender().map((row, index) => (
                    renderRow(row, index)
                ))}

                {emptyRows > 0 && (
                    <TableRow style={{height: 89 * emptyRows}}>
                        <TableCell colSpan={6}/>
                    </TableRow>
                )}
            </TableBody>
        );
    }

    const renderRow = (row, index) => {
        return (
            <TableRow key={rowData(index).name + realIndex(index)}>
                <TableCell style={{width: "10%"}} component="th" scope="row">
                    {realIndex(index) + 1}
                </TableCell>
                <TableCell style={{width: "60%"}}>
                    <ListItemText primary={rowData(index).primary_text} secondary={rowData(index).location_text}/>
                </TableCell>
                <TableCell style={{width: "20%"}} align="right">
                    <ListItemText
                        primary={rowData(index).cumulative_dist + " miles"}
                        secondary={(realIndex(index) > 0) ? `(+${rowData(index).leg_dist})` : "(origin)"}
                    />
                </TableCell>
            </TableRow>
        );
    }

    const renderFooter = () => {
        return (
            <TableFooter>
                <TableRow>
                    <TablePagination
                        size={'small'}
                        rowsPerPageOptions={[5, 10, 20, {label: 'All', value: -1}]}
                        colSpan={3}
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TableActions}
                    />
                </TableRow>
            </TableFooter>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                {renderBody()}
                {renderFooter()}
            </Table>
        </TableContainer>
    );
}


export function TableActions({count, page, rowsPerPage, onChangePage}) {
    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{flexShrink: 0}}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
                <FirstPageIcon/>
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                <KeyboardArrowLeft/>
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <KeyboardArrowRight/>
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <LastPageIcon/>
            </IconButton>
        </div>
    );
}