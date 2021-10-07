import React, { Component } from "react";
import { Form, Input, FormGroup, Label } from "reactstrap";
import { Row, Col, Container, Button } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import "./SetEvent.css";
import AuthService from "../../Services/AuthService";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { API_URL } from "../../constant";
import FriendBtn from "./friendBtn";

class SetEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(),
      title: "",
      description: "",
      endTime: new Date(),
      basic: AuthService.getBasicInfo(),
      redirect: false,
      friendList: [],
      friends: [],
      chosenParticipants: [],
      disabled: false,
    };
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCallBack = this.handleCallBack.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    const { basic } = this.state;
    if (!basic) {
      this.setState({ redirect: true });
    } else {
      await this.getFriendList();
    }
  }

  async getFriendList() {
    const { basic, friends } = this.state;
    const response = await axios.get(API_URL + "/friend/listFriends", {
      headers: {
        Authorization: "Bearer " + basic.token,
      },
    });

    if (response) {
      for (var i = 0; i < response.data.length; i++) {
        await this.getFriendInfo(response.data[i].friendId);
        friends.push(response.data[i].friendId);
        this.setState({ friends });
      }
    }
  }

  /**
   * get friends' detailed info by their id
   * @param {*} id id of interested user
   */
  async getFriendInfo(id) {
    const response = await axios.post(
      API_URL + "/user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + this.state.basic.token,
        },
      }
    );
    if (response.data) {
      let friendList = [...this.state.friendList];
      friendList.push(response.data);
      this.setState({ friendList });
    }
  }

  handleCallBack(id, isSelect) {
    const { chosenParticipants } = this.state;
    if (isSelect) {
      // a participant is selected
      chosenParticipants.push(id);
    } else {
      // deselected
      chosenParticipants.pop(id);
    }
    this.setState({ chosenParticipants });
  }

  handleTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleStartTime(value) {
    this.setState({ startTime: new Date(value) });
  }

  handleEndTime(value) {
    this.setState({ endTime: new Date(value) });
  }

  handleDescription(event) {
    this.setState({ description: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {
      title,
      description,
      chosenParticipants,
      basic,
      startTime,
      endTime,
    } = this.state;
    /* TODO: Call backend API */
    if (startTime > endTime) {
      alert("Start time is invalid");
      return;
    }
    this.setState({ disabled: true });

    const response = await axios.post(
      API_URL + "/meeting/createMeeting",
      {
        participantIds: chosenParticipants,
        startTime: startTime.toJSON(),
        endTime: endTime.toJSON(),
        title: title,
        notes: description,
      },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );
    if (response.data) {
      alert("You have sucessfully created a new event!");
      this.props.history.push("/calendar");
      window.location.reload();
    } else {
      alert("an error has occured " + response);
      this.setState({ disabled: false });
    }
  }

  handleCancel() {
    this.props.history.push("/calendar");
    window.location.reload();
  }

  friendGroup() {
    const { friendList } = this.state;
    return (
      <div className="friend-box">
        <Container>
          <Label className="set-event-label-participant">Participants:</Label>
          <div className="set-event-friends">
          {/* <div class="serch-contact-background"> */}
            {/* <input type="text" placeholder="Search" class="set-event-search-contact" name="search"/> */}
            {/* </div> */}
            {friendList ? (
              friendList.map((friend) => (
                <FriendBtn
                  friend={friend}
                  key={friend.id}
                  callBack={this.handleCallBack}
                />
              ))
            ) : (
              <span>Not Avaliable</span>
            )}
          </div>
        </Container>
      </div>
    );
  }
  render() {
    const { startTime, endTime, redirect, disabled } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="set-event-background">
      <Container>
        <div className="set-event-bar">Schedule</div>
        <Form onSubmit={this.handleSubmit}>
          <Row className="set-event-line">
            <Col xs="5">
              <FormGroup className="set-event-formgroup">
                <Label className="set-event-label">Meeting title:</Label>
                <Input type="text" onChange={this.handleTitle} required></Input>
              </FormGroup>
              <Label className="set-event-label">Start time:</Label>
              <br />
              <DateTimePicker
                onChange={(value) => this.handleStartTime(value)}
                disableClock={true}
                value={startTime}
              />
              <br />
              <Label className="set-event-label">End time:</Label>
              <br />
              <DateTimePicker
                onChange={(value) => this.handleEndTime(value)}
                disableClock={true}
                value={endTime}
              />

              <Label className="set-event-label"> Description: </Label>
              <FormGroup className="set-event-formgroup">
                <Input
                  className="set-event-textarea"
                  type="textarea"
                  onChange={this.handleDescription}
                ></Input>
              </FormGroup>
            </Col>
            <Col xs="7">
              <center>{this.friendGroup()}</center>
            </Col>
          </Row>

          <Row className="save-and-cancel">
            <Col xs="2">
              <Button
                type="submit"
                className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-left"
                disabled={disabled}
              >
                Save Event
              </Button>
            </Col>
            <Col xs="3">
              <Button
                className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-right"
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      </div>
    );
  }
}
export default SetEvent;
