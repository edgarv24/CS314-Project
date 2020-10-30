import React from "react";
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";

export default class BasicModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={() => this.resetState()}>
                <ModalHeader className="mt-1" toggle={() => this.resetState()}>
                    <span className="ml-4">{this.props.tripTitle}</span>
                </ModalHeader>
                <ModalBody>
                    {this.props.bodyContent}
                </ModalBody>
                <ModalFooter>
                    {this.props.footerButtons}
                    <Button id="trip-settings-close" color="primary" type="button" onClick={() => {this.resetState()}}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    resetState() {
        this.props.resetState();
        this.props.toggleOpen();
    };
}