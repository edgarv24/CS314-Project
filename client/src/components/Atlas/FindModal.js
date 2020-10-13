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
    ListGroup,
    ListGroupItem
} from 'reactstrap';

import {isJsonResponseValid, sendServerRequest} from "../../utils/restfulAPI";
import * as findSchema from "../../../schemas/FindResponse.json";

import {PROTOCOL_VERSION} from "../../utils/constants";

export default class DistanceModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            places: null,
            inputText: null,
            listToggle: false
        };
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                    <ModalHeader className="mt-1" toggle={() => this.props.toggleOpen()}>
                        <span className="ml-4">Find Places</span>
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            {this.renderInputBox()}
                            {this.requestFindFromServer(this.state.inputText)}
                            {this.renderList()}
                        </div>
                    </ModalBody>
                    {this.renderSearchButton()}
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
                               onChange={ e => this.setState({inputText: e.target.value}) }
                               value={this.state.inputText || ""}
                        />
                    </InputGroup>
                </Col>
            </Row>
        );
    }

    renderList(){
        if(this.state.listToggle) {
            return (
                <ListGroup>
                    {this.listPlacesItems()}
                </ListGroup>
            )
        }
    }

    listPlacesItems(){
        const listItems = this.state.places.map((d) => <li key={d.name}>{d.name}</li>);
            return(
                <ListGroupItem> {listItems} </ListGroupItem>
            );
    }

    renderSearchButton() {
        return (
            <ModalFooter>
                <Button className="mr-2" color='primary' onClick={() => this.resetModalState()}>Cancel</Button>
            </ModalFooter>
        );
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
            this.setState({places: responseBody.places, listToggle: true});
        } else {
            this.setState({places: null});
        }
    }
}