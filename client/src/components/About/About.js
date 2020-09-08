import React, {Component} from 'react';

import {Container, Row, Col, Button, Media} from 'reactstrap';

import {CLIENT_TEAM_NAME} from "../../utils/constants";

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
                  Our goal is to construct large complex software systems that will utlize clean code, configuration management, continuous integration, testing, project management and teamwork to create a cohesive web development project in five 3-week sprints.
                </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Media heading>
                Team Members
              </Media>
              <Media>
                  <Media left href="#">
                    <Media object src="" alt="Rylie's image" />
                  </Media>
                  <Media body>
                      <Media heading>
                          Rylie Denehan
                      </Media>
                        This is Rylie's bio.
                  </Media>
              </Media>
              <Media>
                <Media left href="#">
                  <Media object src="" alt="Edgar's image" />
                </Media>
                  <Media body>
                    <Media heading>
                      Edgar Varela
                    </Media>
                      This is Edgar's bio.
                  </Media>
                </Media>
              <Media>
                <Media left href="#">
                  <Media object src="" alt="Mikayla's image" />
                </Media>
                  <Media body>
                    <Media heading>
                      Mikayla Powell
                    </Media>
                      This is Mikayla's bio.
                  </Media>
                </Media>
                <Media>
                  <Media left href="#">
                    <Media object src="" alt="Darin's image" />
                  </Media>
                    <Media body>
                      <Media heading>
                        Darin Harter
                      </Media>
                        This is Darin's bio.
                    </Media>
                </Media>
            </Col>
          </Row>
        </Container>
      )
    }
}
