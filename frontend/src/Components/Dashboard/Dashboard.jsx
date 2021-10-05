import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import { Button, Container, Row, Col, Label } from "reactstrap";
import Clock from 'react-live-clock';
import "../../App.css";

import RequestList from "./RequestList";
import ReceivedList from "./ReceivedList";
import Contacts from "./Contacts";
import RecentEvents from "./RecentEvents";


export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      requestList: [],
      receivedRequest: [],
      basic: AuthService.getBasicInfo(),
      currentUser: AuthService.getCurrentUser(),
      redirect: false
        
    }
  }

  componentDidMount() {
    const { basic, currentUser } = this.state;
    if (!basic || !currentUser) this.setState({ redirect: true });

  }

  
  displaySent() {
    if (!this.state.basic) return (<div></div>);
    return (
      <div> 
        <RequestList basic={this.state.basic} />
      </div>
    )
  }

  displayReceived() {
    if (!this.state.basic) return (<div></div>);
    return (
      <div>
        <ReceivedList basic={this.state.basic} />
      </div>
    )
  }

  displayContacts() {
    if (!this.state.basic) return (<div></div>);
    return (
      <div>
        <Contacts basic={this.state.basic} />
      </div>
    )
  }

  displayEvents() {
    if (!this.state.basic) return (<div></div>);
    return (
      <div>
        <RecentEvents basic={this.state.basic} />
      </div>
    )
  }



  render() {
    const { redirect, currentUser } = this.state;
    //if (!currentUser) return (<div></div>);
    if (redirect || !currentUser) return (<Redirect to="/" />);
    
    return (
      <div className="cols">
        <Row>
          <Col >
            <div>
              <Row>
                <Col>
                  <Container>
                    <Row>
                      {this.displaySent()}
                    </Row>
                    <Row>
                      {this.displayReceived()}
                    </Row>
                  </Container>
                </Col>
                <Col>
                  {this.displayContacts()}
                </Col>
              </Row>
            </div>
          </Col>
            
          
          <Col>
            <Container>
              <Row>
                <Label> {"Hi, " + currentUser.first_name}</Label>
              </Row>
              <Row>
                {this.displayEvents()}
              </Row>
              <Row>
                <Col>
                  <Clock 
                    format="HH:mm:ss" 
                    interval={1000} 
                    ticking={true} />
                </Col>
                <Col>
                  <Clock 
                    format="HH:mm:ss" 
                    interval={1000}
                    ticking={true} 
                    timezone={'Etc/GMT'}/>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </div>
    )
  }
}