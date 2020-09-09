import React, {Component} from 'react';

import {Container, Row, Col, Button, Card, CardDeck, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';

import {CLIENT_TEAM_NAME} from "../../utils/constants";

import RyliePicture from "../../static/images/RyliePic.jpg"

export default class About extends Component {
    render() {
      return (
        <Container id="about">
          <Row>
            <Col>
              <h2>{CLIENT_TEAM_NAME}</h2>
            </Col>
            <Col id="closeAbout" xs='auto' >
              <Button color="primary" onClick={this.props.closePage} xs={1}>
                Close
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Mission Statement</h4>
                <p>
                  Our goal is to construct large complex software systems that will utilize clean code, configuration management, continuous integration, testing, project management and teamwork to create a cohesive web development project in five 3-week sprints.
                </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Team Members</h4>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <CardDeck>
                <Card>
                  <CardImg top src={RyliePicture} alt="Rylie's Image" />
                  <CardBody>
                    <CardTitle className="font-weight-bold">Rylie Denehan</CardTitle>
                    <CardText className="text-sm-left">bio. </CardText>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg top width="100%" src="" alt="Edgar's Image" />
                  <CardBody>
                    <CardTitle className="font-weight-bold">Edgar Varela</CardTitle>
                    <CardText className="text-sm-left">bio.</CardText>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg top width="100%" src="" alt="Mikayla's Image" />
                  <CardBody>
                    <CardTitle className="font-weight-bold">Mikayla Powell</CardTitle>
                    <CardText className="text-sm-left">bio.</CardText>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg top width="100%" src="" alt="Darin's Image" />
                  <CardBody>
                    <CardTitle className="font-weight-bold">Darin Harter</CardTitle>
                    <CardText className="text-sm-left">bio.</CardText>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          </Row>
        </Container>
      )
    }
}
