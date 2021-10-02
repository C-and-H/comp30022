import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import { Button, Container, Row, Col, Label } from "reactstrap";
import "../../App.css";
import RequestList from "./RequestList";
import ReceivedList from "./ReceivedList";

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

  async componentDidMount() {
    const { basic, currentUser } = this.state;
    if (!basic) this.setState({ redirect: true });

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

  search() {
    return (
      <div></div>
    )
  }

  displayEvents() {
    
  }



  render() {
    const { redirect } = this.state;
    if (redirect) return (<Redirect to="/" />);
    return (
      <Container>
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
            {this.search()}
          </Col>
          <Col>
            <Container>
              <Row>

              </Row>
              <Row>
                {this.displayEvents()}
              </Row>
              <Row>
                <Col>
                </Col>
                <Col>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    )
  }
}