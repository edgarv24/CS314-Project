import React from "react";
import { Button, Col, Input, Modal, ModalBody, ModalFooter, Row } from "reactstrap";

import { sendServerRequest, isJsonResponseValid } from "../../utils/restfulAPI";
import {renderModalTitleHeader, renderCancelButton} from "../Atlas/Modals/modalHelper";

import * as configSchema from "../../../schemas/ConfigResponse";
import {PROTOCOL_VERSION} from "../../utils/constants";

import {LOG} from "../../utils/constants";

export default class ServerSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: this.props.serverSettings.serverPort,
            validServer: null,
            config: {}
        };

        this.saveInputText = this.state.inputText;
    }

    render() {
        return (
            <Modal id="server-settings-modal" isOpen={this.props.isOpen} toggle={() => this.props.toggleOpen()}>
                {renderModalTitleHeader("Server Connection", () => this.props.toggleOpen())}
                {this.renderSettings(this.getCurrentServerName())}
                {this.renderActions()}
            </Modal>
        );
    }

    renderSettings(currentServerName) {
        return (
            <ModalBody>
                {this.renderSettingsRow("Name:", currentServerName)}
                {this.renderSettingsRow("Type:", this.getRequestType())}
                {this.renderSettingsRow("Version:", PROTOCOL_VERSION)}
                {this.renderSettingsRow("Supported:", this.getSupportedRequestTypes())}
                {this.renderSettingsRow("Airport Filters:", this.getAirportFilters())}
                {this.renderSettingsRow("Geographic Filters:", "country")}
                {this.renderSettingsRow("URL:", this.renderInputField())}
            </ModalBody>
        );
    }

    renderSettingsRow(label, value) {
        return (
            <Row className="m-2">
                <Col xs={5}>
                    {label}
                </Col>
                <Col xs={7}>
                    {value}
                </Col>
            </Row>
        );
    }

    renderInputField() {
        let valid = this.state.validServer === null ? false : this.state.validServer;
        let notValid = this.state.validServer === null ? false : !this.state.validServer;
        return(
            <Input onChange={(e) => this.updateInput(e.target.value)}
                   value={this.state.inputText}
                   placeholder={this.props.serverPort}
                   valid={valid}
                   invalid={notValid}
            />
        );
    }

    renderActions() {
        return (
            <ModalFooter>
                <Button color="primary" onClick={() =>
                {
                    this.props.processServerConfigSuccess(this.state.config, this.state.inputText);
                    this.resetServerSettingsState(this.state.inputText);
                }}
                        disabled={!this.state.validServer}
                >
                    Save
                </Button>
                {renderCancelButton('close-server-settings', () => this.resetServerSettingsState())}
            </ModalFooter>
        );
    }

    getCurrentServerName() {
        let currentServerName = this.props.serverSettings.serverConfig && this.state.validServer === null ?
                                this.props.serverSettings.serverConfig.serverName : "";
        if (this.state.config && Object.keys(this.state.config).length > 0) {
            currentServerName = this.state.config.serverName;
        }
        return currentServerName;
    }

    getRequestType() {
        return configSchema.title;
    }

    getSupportedRequestTypes() {
        let requests = configSchema.properties.supportedRequests.items.enum;
        return `${requests[0]}, ${requests[1]}, ${requests[2]}, ${requests[3]}`;
    }

    getAirportFilters() {
        let types = configSchema.properties.filters.properties.type.items.enum;
        return `${types[0]}, ${types[1]}, ${types[2]}`;
    }

    updateInput(value) {
        this.setState({inputText: value}, () => {
            if (this.shouldAttemptConfigRequest(value)) {
                sendServerRequest({requestType: "config", requestVersion: PROTOCOL_VERSION}, value)
                    .then(config => {
                        if (config) { this.processConfigResponse(config.data) }
                        else { this.setState({validServer: true, config: config}); }
                    });
            } else {
                this.setState({validServer: false, config: {}});
            }
        });
    }

    shouldAttemptConfigRequest(resource) {
        const urlRegex = /https?:\/\/.+/;
        return resource.match(urlRegex) !== null && resource.length > 15;
    }

    processConfigResponse(config) {
        LOG.info(config);
        if (!isJsonResponseValid(config, configSchema)) {
            this.setState({validServer: false, config: false});
        } else {
            this.setState({validServer: true, config: config});
        }
    }

    resetServerSettingsState(inputText=this.saveInputText) {
        this.props.toggleOpen();
        this.setState({
            inputText: inputText,
            validServer: null,
            config: false
        });
    }
}
