import React, { Component } from "react";
import { Form, Input, FormGroup, Label } from "reactstrap";
import { Row, Col, Container, Button, ToggleButton, ButtonGroup, ToggleButtonGroup } from 'react-bootstrap';
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
      endTime: new Date(),
      basic: AuthService.getBasicInfo(),
      redirect: false,
      friendList: [],
      friends: []
    }
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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


  friendGroup() {
    const { friendList} = this.state;

    return (
      <Container>
        <Label className="set-event-label">Choose participants:</Label>
        <div className="set-event-friends">
          {friendList ? (
           
            friendList.map((friend) => (
              
              <FriendBtn 
                friend={friend}
                key={friend.id}
                
              />
            ))
            
          ) : (
            <></>
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
    //console.log(friendList);
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
          <Row className="set-event-line">
            {this.friendGroup()}
          </Row>
        </Form>
        

      </Container>
    );
  }
}
export default SetEvent;