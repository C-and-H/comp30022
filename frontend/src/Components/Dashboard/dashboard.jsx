import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import { Container, Row, Col, Label } from "reactstrap";
import Clock from "react-live-clock";
import "../../App.css";

import RequestList from "./requestList";
import ReceivedList from "./receivedList";
import Contacts from "./contacts";
import RecentEvents from "./recentEvents";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      requestList: [],
      receivedRequest: [],
      basic: AuthService.getBasicInfo(),
      currentUser: AuthService.getCurrentUser(),
      redirect: false,
    };
  }

  async componentDidMount() {
    const { basic, currentUser } = this.state;
    if (!basic){
       this.setState({ redirect: true });
    } else if (!currentUser){
      const user = await AuthService.getUserDataFromBackend(basic.token, basic.id);
      this.setState({ currentUser: user});
    }
  }

  displaySent() {
    if (!this.state.basic) return <div></div>;
    return (
      <div>
        <RequestList basic={this.state.basic} />
      </div>
    );
    
  }

  displayReceived() {
    if (!this.state.basic) return <div></div>;
    return (
      <div>
        <ReceivedList basic={this.state.basic} />
      </div>
    );
  }

  displayContacts() {
    if (!this.state.basic) return <div></div>;
    return (
      <div>
        <Contacts basic={this.state.basic} />
      </div>
    );
  }

  displayEvents() {
    if (!this.state.basic) return <div></div>;
    return (
      <div>
        <RecentEvents basic={this.state.basic} />
      </div>
    );
  }

  render() {
    const { redirect, currentUser } = this.state;
    //if (!currentUser) return (<div></div>);
    if (redirect) return <Redirect to="/home" />;
    if (!currentUser) return <div></div>

    return (
      <div className="cols">
        <Row>
          <Col>
            <div>
              <Row>
                <Col className="over">
                  <Container>
                    <Row>{this.displaySent()}</Row>
                    <Row>{this.displayReceived()}</Row>
                  </Container>
                </Col>
                <Col>{this.displayContacts()}</Col>
              </Row>
            </div>
          </Col>

          <Col className="right">
            <div>
              <Row>
                <Label className="name-label">
                  {"Hi, " + currentUser.first_name}
                </Label>
              </Row>
              <Row>{this.displayEvents()}</Row>
              <Row>
                <Col>
                  <div className="clock-frame">
                    <br />
                    <br />
                    <span className="time-zone"> Local Time </span>
                    <br />
                    <br />
                    <br />

                    <Clock
                      format={"h:mm:ss A, dddd"}
                      interval={1000}
                      ticking={true}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="clock-frame">
                    <br />
                    <br />
                    <span className="time-zone"> UTC Time </span>
                    <br />
                    <br />
                    <br />
                    <Clock
                      className="clock"
                      format={"h:mm:ss A, dddd"}
                      interval={1000}
                      ticking={true}
                      timezone={"Etc/GMT"}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
