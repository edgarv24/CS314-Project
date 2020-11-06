import React from "react";
import {Button} from "reactstrap";

import {Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow} from '@material-ui/core';
import {Box, Collapse, IconButton, ListItemText, Paper, Typography} from '@material-ui/core';

import {FirstPage, LastPage, Edit, Delete} from '@material-ui/icons';
import {KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';

export class DestinationTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);

        this.state = {
            page: 0,
            rowsPerPage: 5,
            openRow: -1
        };
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table>
                    {this.renderBody()}
                    {this.renderFooter()}
                </Table>
            </TableContainer>
        );
    }

    renderBody() {
        return (
            <TableBody>
                {this.calculateRowsToRender().map((_, index) => (
                    <DestinationTableRow key={this.rowData(index).id}
                                         rowData={this.rowData(index)}
                                         index={this.realIndex(index)}
                                         collapseIsOpen={this.state.openRow === this.realIndex(index)}
                                         setOpenRow={(row) => this.setState({openRow: row})}/>
                ))}

                {this.emptyRows() > 0 && (
                    <TableRow style={{height: 89 * this.emptyRows()}}>
                        <TableCell colSpan={6}/>
                    </TableRow>
                )}
            </TableBody>
        );
    }

    renderFooter() {
        return (
            <TableFooter>
                <TableRow>
                    <TablePagination
                        size={'small'}
                        rowsPerPageOptions={[5, 10, 20, {label: 'All', value: -1}]}
                        colSpan={4}
                        count={this.props.data.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TableActions}
                    />
                </TableRow>
            </TableFooter>
        );
    }

    emptyRows() {
        const rowsPerPage = this.state.rowsPerPage;
        const page = this.state.page;
        return rowsPerPage - Math.min(rowsPerPage, this.props.data.length - page * rowsPerPage);
    }

    handleChangePage(event, newPage) {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage(event) {
        const newRowsPerPage = parseInt(event.target.value, 10);
        this.setState({rowsPerPage: newRowsPerPage, page: 0})
    };

    realIndex(index) {
        return index + this.state.rowsPerPage * this.state.page;
    };

    rowData(index) {
        return this.props.data[this.realIndex(index)];
    };

    calculateRowsToRender() {
        const rowsPerPage = this.state.rowsPerPage;
        const page = this.state.page;
        return (rowsPerPage > 0)
            ? this.props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : this.props.data;
    };
}

export class DestinationTableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {this.renderBody()}
                {this.renderCollapseSection()}
            </>
        );
    }

    renderBody() {
        return (
            <TableRow hover onClick={() => this.props.setOpenRow(this.props.collapseIsOpen ? -1 : this.props.index)}>
                <TableCell style={{width: "5%"}}>
                    {this.props.collapseIsOpen ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                </TableCell>
                <TableCell style={{width: "5%"}} component="th" scope="row">
                    {this.props.index + 1}
                </TableCell>
                <TableCell style={{width: "60%"}}>
                    <ListItemText primary={this.props.rowData.primary_text} secondary={this.props.rowData.location_text}/>
                </TableCell>
                <TableCell style={{width: "20%"}} align="right">
                    <ListItemText
                        primary={this.props.rowData.cumulative_dist + " miles"}
                        secondary={(this.props.index > 0) ? `(+${this.props.rowData.leg_dist})` : "(origin)"}
                    />
                </TableCell>
            </TableRow>
        );
    }

    renderCollapseSection() {
        return (
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
                    <Collapse in={this.props.collapseIsOpen} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            <Typography className="d-inline-block" variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Button className="float-right" id={`remove-${this.props.rowData.id}`} outline size="sm"
                                    color="danger" onClick={() => undefined}>
                                <Delete/>
                            </Button>
                            <Button className="float-right mr-3" id={`edit-${this.props.rowData.id}`} outline size="sm"
                                    color="primary" onClick={() => undefined}>
                                <Edit/>
                            </Button>
                            {this.renderDetailsTable()}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        );
    }

    renderDetailsTable() {
        return (
            <Table size="small">
                <TableBody>
                    {['name', 'latitude', 'longitude', 'state', 'municipality', 'country', 'altitude', 'notes']
                        .filter(item => this.props.rowData[item]).map(key =>
                            <TableRow key={key + this.props.index}>
                                <TableCell component="th" scope="row">
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                </TableCell>
                                <TableCell>
                                    {`${this.props.rowData[key]}`}
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        );
    }
}

export function TableActions({count, page, rowsPerPage, onChangePage}) {
    const handleFirstPageButtonClick = (event) => onChangePage(event, 0);
    const handleBackButtonClick = (event) => onChangePage(event, page - 1);
    const handleNextButtonClick = (event) => onChangePage(event, page + 1);
    const handleLastPageButtonClick = (event) => onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    const BACK_DISABLED = page === 0;
    const FORWARD_DISABLED = page >= Math.ceil(count / rowsPerPage) - 1;
    return (
        <div style={{flexShrink: 0}}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={BACK_DISABLED}><FirstPage/></IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={BACK_DISABLED}><KeyboardArrowLeft/></IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={FORWARD_DISABLED}><KeyboardArrowRight/></IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={FORWARD_DISABLED}><LastPage/></IconButton>
        </div>
    );
}