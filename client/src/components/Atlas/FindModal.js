import React, {Component} from 'react';
import {
    Button,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from 'reactstrap';

import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as findSchema from "../../../schemas/FindResponse.json";

import {PROTOCOL_VERSION} from "../../utils/constants";

import ListItem from "@material-ui/core/ListItem";
import Atlas from "./Atlas";

export default class FindModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            places: null,
            inputText: null,
            listToggle: false,
            buttonToggle: false,
            selectedPlace: null
        };
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader className="mt-1" toggle={() => this.props.toggleOpen()}>
                        <span className="ml-4">Find Places</span>
                    </ModalHeader>
                    <ModalBody >
                        <div>
                            {this.renderInputBox()}
                        </div>
                    </ModalBody>
                    <ModalBody style={{'maxHeight': '30vh', 'overflowY': 'auto'}}>
                        <div>
                            {this.renderList()}
                        </div>
                    </ModalBody>
                    {this.renderButtons()}
                </Modal>
            </div>
        );
    }

    renderInputBox() {
        return (
            <Row className="ml-2 mr-2 mt-3 mb-4">
                <Col>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">{`Name`}</InputGroupAddon>
                        <Input placeholder="Enter place"
                               onChange={ e => {this.setState({inputText: e.target.value})
                               this.requestFindFromServer(e.target.value)} }
                               value={this.state.inputText || ""}
                        />
                    </InputGroup>
                </Col>
            </Row>
        );
    }

    renderList(){
        if(this.state.listToggle) {
            const listItems = this.state.places.map(item => <ListItem button key={item.name} onClick={() => this.setState({selectedPlace: item})}>{item.name}</ListItem>);
            return (
                listItems
            )
        }
    }

    renderButtons() {
        return (
            <ModalFooter>
                {this.renderLocateButton()}
                <Button className="mr-2" color='primary' onClick={() => this.resetModalState()}>Cancel</Button>
            </ModalFooter>
        );
    }

    renderLocateButton(){
        if (this.state.buttonToggle){
            return(
                <Button id="locate-button" className="mr-2" color='primary' onClick={() => Atlas.prototype.processFindRequestViewLocation(this.state.selectedPlace)}> Locate </Button>
            );
        }
    }

    resetModalState() {
        this.props.toggleOpen();
        this.setState({
            places: null,
            inputText: null,
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
            limit: 10,
        }
    }

    processFindResponse(responseJSON) {
        const responseBody = responseJSON.data;
        if (isJsonResponseValid(responseBody, findSchema)) {
            this.setState({places: responseBody.places, listToggle: true, buttonToggle: true});
        } else {
            this.setState({places: null});
        }
    }
}