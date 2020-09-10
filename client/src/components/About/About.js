import React, {Component} from 'react';

import {Container, Row, Col, Button, Card, CardBody, CardImg, CardTitle, CardText} from 'reactstrap';

import {CLIENT_TEAM_NAME} from "../../utils/constants";

import RyliePicture from "../../static/images/RyliePic.jpg";
import DarinPicture from "../../static/images/Darin.png";

const DarinBio = "Darin is a third year student at Colorado State University, where he is studying computer science with" +
    " a minor in math. He was born and raised in Fort Collins, Colorado, so he knows the area well. Programming is one" +
    " of his favorite things to do, and he spends a great deal of time learning new tools and writing games and" +
    " applications in his free time. When he’s not programming, he enjoys listening to music, reading, playing Nintendo" +
    " games, and watching Colorado sports teams on TV. He generally considers himself a hard worker who likes to get" +
    " assignments done right and on time. He is more of a listener than a speaker, and he is always looking for ways" +
    " to help others. He has a brown Shorkie dog named Lily and one brother who is a CSU alumni currently seeking a" +
    " Masters in CS at Georgia Tech. A goal for his future is to travel and explore the world, since he hasn’t been" +
    " more than a few states away from home.";

const RylieBio = "Rylie is a fifth year Computer Science student at Colorado State University. She has lived in Colorado" +
    " for the last six years and loves to hike in the summer and ski in the winter. She is interested in cybersecurity" +
    " and currently has a full-time position as an Information Systems Security Engineer in Colorado Springs. Along with" +
    " learning cybersecurity tools, she enjoys watching movies and shows with friends, listening to music, and baking." +
    " Her twin sister graduated from CSU last spring with a BS in Conservation Biology and her older brother is currently" +
    " earning his EMT certification. Rylie enjoys helping and learning with others and works well in a team environment. A" +
    " goal that she has is to do penetration testing work sometime in the near future.";

export default class About extends Component {
    render() {
        return (
            <Container id="about">
                <Row>
                    <Col>
                        <h2>{CLIENT_TEAM_NAME}</h2>
                    </Col>
                    <Col id="closeAbout" xs='auto'>
                        <Button color="primary" onClick={this.props.closePage} xs={1}>
                            Close
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Mission Statement</h4>
                        <p>
                            Our goal is to construct large complex software systems that will utilize clean code,
                            configuration management, continuous integration, testing, project management and teamwork
                            to create a cohesive web development project in five 3-week sprints.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Team Members</h4>
                    </Col>
                </Row>
                <Row>
                    <BioCard first="Rylie" last="Denehan" bio={RylieBio} imageURL={RyliePicture} />
                    <BioCard first="Edgar" last="Varela" bio={"Bio here."} imageURL={""} />
                    <BioCard first="Mikayla" last="Powell" bio={"Bio here."} imageURL={""} />
                    <BioCard first="Darin" last="Harter" bio={DarinBio} imageURL={DarinPicture} />
                </Row>
            </Container>
        )
    }
}

class BioCard extends React.Component {
    render() {
        return (
            <Col xs="12" sm="12" md="6" lg="6" xl="4">
                <Card>
                    <CardImg top width="100%" src={this.props.imageURL} alt={this.props.first + "'s Image"}/>
                    <CardBody>
                        <CardTitle className="font-weight-bold">{this.props.first + " " + this.props.last}</CardTitle>
                        <CardText className="text-sm-left">{this.props.bio}</CardText>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}