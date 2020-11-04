import React from "react";
import {Button, ModalHeader} from "reactstrap";

export const renderModalTitleHeader = (title, toggle) => {
    return (
        <ModalHeader className="mt-1" toggle={toggle}>
            <span className="ml-4">{title}</span>
        </ModalHeader>
    );
}

export const renderCancelButton = (id, resetState) => {
    return (
        <Button id={id} color="danger" onClick={resetState}>Cancel</Button>
    );
}