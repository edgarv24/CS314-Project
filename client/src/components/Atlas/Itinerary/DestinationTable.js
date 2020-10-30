import React from "react";
import {Button} from "reactstrap";

import {Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow} from '@material-ui/core';
import {Box, Collapse, IconButton, ListItemText, Paper, Typography} from '@material-ui/core';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export const DestinationTable = ({data}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openRow, setOpenRow] = React.useState(-1);

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
                {calculateRowsToRender().map((_, index) => (
                    <DestinationTableRow key={rowData(index).id} rowData={rowData(index)} index={realIndex(index)}
                                         collapseIsOpen={openRow === realIndex(index)}
                                         setOpenRow={(row) => setOpenRow(row)}/>
                ))}

                {emptyRows > 0 && (
                    <TableRow style={{height: 89 * emptyRows}}>
                        <TableCell colSpan={6}/>
                    </TableRow>
                )}
            </TableBody>
        );
    }

    const renderFooter = () => {
        return (
            <TableFooter>
                <TableRow>
                    <TablePagination
                        size={'small'}
                        rowsPerPageOptions={[5, 10, 20, {label: 'All', value: -1}]}
                        colSpan={4}
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

export function DestinationTableRow({rowData, index, collapseIsOpen, setOpenRow}) {
    const renderBody = () => {
        return (
            <TableRow hover onClick={() => setOpenRow(collapseIsOpen ? -1 : index)}>
                <TableCell style={{width: "5%"}}>
                    {collapseIsOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </TableCell>
                <TableCell style={{width: "5%"}} component="th" scope="row">
                    {index + 1}
                </TableCell>
                <TableCell style={{width: "60%"}}>
                    <ListItemText primary={rowData.primary_text} secondary={rowData.location_text}/>
                </TableCell>
                <TableCell style={{width: "20%"}} align="right">
                    <ListItemText
                        primary={rowData.cumulative_dist + " miles"}
                        secondary={(index > 0) ? `(+${rowData.leg_dist})` : "(origin)"}
                    />
                </TableCell>
            </TableRow>
        );
    }

    const renderCollapseSection = () => {
        return (
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
                    <Collapse in={collapseIsOpen} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            <Typography className="d-inline-block" variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Button className="float-right" id={`remove-${rowData.id}`} outline size="sm"
                                    color="danger" onClick={() => undefined}>
                                <DeleteIcon/>
                            </Button>
                            <Button className="float-right mr-3" id={`edit-${rowData.id}`} outline size="sm"
                                    color="primary" onClick={() => undefined}>
                                <EditIcon/>
                            </Button>
                            {renderDetailsTable()}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        );
    }

    const renderDetailsTable = () => {
        return (
            <Table size="small">
                <TableBody>
                    {['name', 'latitude', 'longitude', 'state', 'municipality', 'country', 'altitude', 'notes']
                        .filter(item => rowData[item]).map(key =>
                            <TableRow key={key + index}>
                                <TableCell component="th" scope="row">
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                </TableCell>
                                <TableCell>
                                    {`${rowData[key]}`}
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        );
    }

    return (
        <>
            {renderBody()}
            {renderCollapseSection()}
        </>
    );
}

export function TableActions({count, page, rowsPerPage, onChangePage}) {
    const handleFirstPageButtonClick = (event) => onChangePage(event, 0);
    const handleBackButtonClick = (event) => onChangePage(event, page - 1);
    const handleNextButtonClick = (event) => onChangePage(event, page + 1);
    const handleLastPageButtonClick = (event) => onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

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