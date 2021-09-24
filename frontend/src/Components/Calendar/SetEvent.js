import React, { Component } from "react";
import { Form, Input, FormGroup, Label } from "reactstrap";
import { Row, Col, Container, Button } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import '../../App.css';
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
      chosenParticipants: []
    }
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
      this.setState({ redirect: true});
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
      //console.log(response.data)
      let friendList = [...this.state.friendList];
      friendList.push(response.data);
      // console.log(friendList)
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
    console.log(this.state.startTime);
  }

  handleEndTime(value) {
    this.setState({ endTime: new Date(value) });
    console.log(this.state.endTime);
  }

  handleDescription(event) {
    this.setState({ description: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { title, description, chosenParticipants, basic,
            startTime, endTime 
          } = this.state;

    /* TODO: Call backend API */
    

  }

  handleCancel() {
    window.location = "/calendar";
  }


  friendGroup() {
    const { friendList, chosenParticipants} = this.state;
    //console.log(chosenParticipants);
    return (
      <Container>
        <Label className="set-event-label">Choose participants:</Label>
        <div className="set-event-friends">
          {friendList ? (
           
            friendList.map((friend) => (
              
              <FriendBtn 
                friend={friend}
                key={friend.id}
                callBack = {this.handleCallBack}
              />
            ))
            
          ) : (
            <span>Not Avaliable</span>
          )}
        </div>
        
      </Container>
    )
  }


  render(){
    const { 
      startTime, endTime, redirect, friendList
     } = this.state;


    if (redirect) {
      return (<Redirect to="/" />);
    }
    //console.log(this.state.chosenParticipants);
    return (
      <Container className="set-event-container">
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
          <Row className="set-event-line">
        
            {this.friendGroup()}

            <Col></Col>
          </Row>

          <Row className="set-event-description">
            <Col>
              <Label className="set-event-lable"> Description: </Label>
              <FormGroup className="set-event-formgroup">
                <Input
                  className="set-event-textarea"
                  type="textarea"
                  onChange={this.handleDescription}
                ></Input>
              </FormGroup>
            </Col>
            <Col></Col>
          </Row>

          <Row className="set-event-line">
            <Col>
              <Button className="set-event-save" type="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button className="set-event-cancel" onClick={this.handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </Form>
        

      </Container>
    );
  }
}
export default SetEvent;