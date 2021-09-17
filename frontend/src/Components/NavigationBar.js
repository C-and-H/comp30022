import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import "../App.css";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends Component {
  /** helper function: get one notification as a dropdown item */
  getNotificationDropDownItem(notification) {
    return (
      <NavDropdown.Item
        key={notification.id}
        onClick={() => this.props.removeNotification(notification.id)}
      >
        <p className="notify-dropdown dropdown-text">
          {notification.message}
          <div className="dropdown-time dropdown-text">
            {new Date(notification.when).toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </p>
      </NavDropdown.Item>
    );
  }

  /** get all notifications as dropdown items */
  getAllNotificationDropDownItem(notifications) {
    if (notifications) {
      return notifications.map((notification) =>
        this.getNotificationDropDownItem(notification)
      );
    } else {
      return null;
    }
  }

  logIn() {
    let notifications = JSON.parse(localStorage.getItem("notifications"));
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

        <NavDropdown
          autoClose="outside"
          eventkey={this.props.notificationNumber}
          title={
            <span>
              <i className="fa fa-rocket"></i>
              Inbox
              {this.props.notificationNumber !== 0 && (
                <span className="badge badge-warning notification-badge">
                  {" "}
                  {this.props.notificationNumber}{" "}
                </span>
              )}
            </span>
          }
          id="basic-nav-dropdown"
          onClick={this.props.onGetNotification}
        >
          {this.props.notificationNumber === 0 ? (
            <NavDropdown.ItemText className="dropdown-text">
              No new message
            </NavDropdown.ItemText>
          ) : (
            <div>
              {notifications !== null && notifications.length !== 0 ? (
                <NavDropdown.Item>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={this.props.removeAllNotifications}
                  >
                    mark all as read
                  </Button>
                </NavDropdown.Item>
              ) : (
                <NavDropdown.ItemText classname="dropdown-text">
                  loading...
                </NavDropdown.ItemText>
              )}

              <NavDropdown.Divider />
              {this.getAllNotificationDropDownItem(notifications)}
            </div>
          )}
        </NavDropdown>

        <Nav.Link className={"navbar_nav"} onClick={this.props.onLogOut}>
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
