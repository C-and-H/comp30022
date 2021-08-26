import React from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends React.Component {
  logIn() {
    return (
      <Nav>
        <Nav.Link href="/profile" className={"navbar_nav"}>
          <i className="fa fa-user fa-fw"></i>
          {this.props.user.username}
        </Nav.Link>
        <Nav.Link
          href="/login"
          className={"navbar_nav"}
          onClick={this.props.onLogOut}
        >
          LogOut
        </Nav.Link>
        <NavDropdown
          eventKey={3}
          title={
            <span>
              <i class="fas fa-cog"></i> Setting
            </span>
          }
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="/profile">
            <i className="fa fa-user fa-fw"></i>
            {this.props.user.username}
          </NavDropdown.Item>
          <NavDropdown.Item href="/setting">
            <i class="fas fa-cog"></i> Setting
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
          <i class="fas fa-user-plus"></i> Register
        </Nav.Link>
        <Nav.Link href="login" className={"navbar_nav"}>
          <i class="fas fa-sign-in-alt"></i> Login
        </Nav.Link>
        {/* <NavDropdown
          eventKey={3}
          title={
            <span>
              <i className="fa fa-user fa-fw"></i> Setting
            </span>
          }
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="/signup">
            <i class="fas fa-user-plus"></i> Register
          </NavDropdown.Item>
          <NavDropdown.Item href="/login">
            <i class="fas fa-sign-in-alt"></i> Login
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/setting">
            <i class="fas fa-cog"></i> Setting
          </NavDropdown.Item>
        </NavDropdown> */}
      </Nav>
    );
  }

  render() {
    console.log(this.props.user);
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <i class="fas fa-users-cog"></i> CRM Application
          </Navbar.Brand>
          {this.props.user ? this.logIn() : this.notLogIn()}
        </Container>
      </Navbar>
    );
  }
}

export default NavigationBar;
