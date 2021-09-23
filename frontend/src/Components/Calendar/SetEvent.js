import React, { Component } from "react";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import { Row, Col, Container } from 'reactstrap';
import DateTimePicker from 'react-datetime-picker';
import '../../App.css';

class SetEvent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(),
      title: "",
      endTime: new Date()
    }
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleTitle(event) {
    this.setState({title: event.target.value});
  }

  handleStartTime(value) {

    this.setState({ startTime: new Date(value) });
    console.log(this.state.startTime);
  }

  handleEndTime(value) {
    this.setState({ endTime: new Date(value) });
    console.log(this.state.endTime);
  }

  async handleSubmit() {

  }

  render(){
    const { startTime, endTime } = this.state;
    return (
      <Container>
        {/* <DateTimePicker
          onChange={(value) => this.handleDateSelection(value)}
          value={value}
        /> */}
        <Row className="set-event-bar"> Create a new event </Row>
        
        <Form onSubmit={this.handleSubmit}>
          <Row className="set-event-line">
            <Col>
              <FormGroup className="set-event-formgroup">
                <Label className="set-event-label">Meeting title:</Label>
                <Input 
                  type="text"
                  onChange={this.handleTitle}
                  required
                ></Input>
              </FormGroup>
            </Col>
            <Col></Col>
          </Row>

          <Row className="set-event-line">
            <Col>
              <Label className="set-event-label">Start time:</Label>
              <DateTimePicker
                onChange= {(value) => this.handleStartTime(value)}
                value = {startTime}
              />

            </Col>
            <Col>
              <Label className="set-event-label">End time:</Label>
                <DateTimePicker
                  onChange= {(value) => this.handleEndTime(value)}
                  value = {endTime}
                />
            </Col>
          </Row>
        </Form>
        

      </Container>
    );
  }
}
export default SetEvent;