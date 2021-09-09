import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import AuthService from "../Services/AuthService";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { API_URL } from "../constant";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      notificationNumber: 0,
      stompClient: null
    };

    this.connectCallback = this.connectCallback.bind(this);
  }

  async componentDidMount() {
    this.connect();
    await this.sleep(5000);
    this.sendUserId();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  connect() {
    var self = this;
    var socket = new SockJS(API_URL + '/candh-crm-websocket');
    self.stompClient = Stomp.over(socket);
    self.stompClient.connect({}, function (frame) {
        console.log('Connected: ' );
        console.log(frame);
        console.log('Hello!!!');
        this.isConnected = true;
        self.stompClient.subscribe('/topic/notification', self.connectCallback);
        console.log("Subscribed!");
        //this.sendUserId();
    });
  }

  connectCallback (numNotification) {
    console.log("New push come!");
    console.log(numNotification.body);
    this.notificationNumber = numNotification.body;
  }

  sendUserId() {
    console.log("send user id " + AuthService.getBasicInfo().id);
    this.stompClient.send("/app/notification/unread", {}, JSON.stringify({'id': AuthService.getBasicInfo().id}));
  }

  logIn() {
    var notificationNumber = 4;
    //notificationNumber = this.notificationNumber;
    return (
      <Nav>
        <Nav.Link href="/profile" className={"navbar_nav"}>
          <i className="fa fa-user fa-fw"></i>
          {this.props.user.first_name}
        </Nav.Link>
        <Nav.Link href="/contact" className={"navbar_nav"}>
          <i className="fa fa-user-friends"></i>
          Contacts
        </Nav.Link>
        <Nav.Link href="/searchUser" className={"navbar_nav"}>
          <i className="fa fa-search"></i>
          Search
        </Nav.Link>
        
        {notificationNumber !== 0 ?
            <NavDropdown
              eventkey={notificationNumber}
              title={
                <span>
                  <i className="fa fa-rocket"></i>
                  Inbox
                  <span className='badge badge-warning notification-badge'> {notificationNumber} </span> 
                </span>
              }
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">
                <i className="fa fa-user fa-fw"></i>
                {this.props.user.first_name}
              </NavDropdown.Item>
              <NavDropdown.Item href="/contact">
                <i className="fa fa-user-friends"></i>
                Contacts
              </NavDropdown.Item>
              <NavDropdown.Item href="/setting">
                <i className="fas fa-cog"></i> Setting
              </NavDropdown.Item>

              <NavDropdown.Divider />
            </NavDropdown>
            : 
            <Nav.Link className={"navbar_nav"}>
              <i className="fa fa-rocket"></i>
              Inbox         
            </Nav.Link>}
        <Nav.Link
          href="/login"
          className={"navbar_nav"}
          onClick={this.props.onLogOut}
        >
          LogOut
        </Nav.Link>
        <NavDropdown
          eventkey={3}
          title={
            <span>
              <i className="fas fa-cog"></i> Setting
            </span>
          }
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="/profile">
            <i className="fa fa-user fa-fw"></i>
            {this.props.user.first_name}
          </NavDropdown.Item>
          <NavDropdown.Item href="/contact">
            <i className="fa fa-user-friends"></i>
            Contacts
          </NavDropdown.Item>
          <NavDropdown.Item href="/setting">
            <i className="fas fa-cog"></i> Setting
          </NavDropdown.Item>

          <NavDropdown.Divider />
          <NavDropdown.Item href="/login" onClick={this.props.onLogOut}>
            LogOut
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    );
  }

  notLogIn() {
    return (
      <Nav>
        <Nav.Link href="/signup" className={"navbar_nav"}>
          <i className="fas fa-user-plus"></i> Register
        </Nav.Link>
        <Nav.Link href="login" className={"navbar_nav"}>
          <i className="fas fa-sign-in-alt"></i> Login
        </Nav.Link>
      </Nav>
    );
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <i className="fas fa-users-cog"></i> CRM Application
          </Navbar.Brand>
          {this.props.user ? this.logIn() : this.notLogIn()}
        </Container>
      </Navbar>
    );
  }
}

export default NavigationBar;
