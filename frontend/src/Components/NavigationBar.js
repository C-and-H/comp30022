import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import AuthService from "../Services/AuthService";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      notificationNumber: 0
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    this.connect();
    
  }

  connect() {
    var stompClient = null;
    var socket = new SockJS('/candh-crm-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        stompClient.subscribe('/topic/notification', function (numNotification) {
            console.log("Subscribe!");
        });
    });
  }

  logIn() {
    const notificationNumber = 4;
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
