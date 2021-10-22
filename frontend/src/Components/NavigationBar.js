import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { BallRunningDots } from "react-pretty-loading";

import "../App.css";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends Component {
  /** helper function: get one notification as a dropdown item */
  getNotificationDropDownItem(notification) {
    return (
      <NavDropdown.ItemText
        key={notification.id}
        // onClick={() => this.props.removeNotification(notification.id)}
      >
        <div className="notify-dropdown">
          <div className="dropdown-text">
            {notification.message}
            <br />
            <span>
              {new Date(notification.when).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="div-notify-delete-nav-dropdown">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => this.props.removeNotification(notification.id)}
            >
              x
            </Button>
          </div>
        </div>
      </NavDropdown.ItemText>
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
        <Nav.Link href="/dashboard" className={"navbar_nav"}>
          Dashboard
        </Nav.Link>
        <Nav.Link href="/chat" className={"navbar_nav"}>
          Chat
        </Nav.Link>
        <NavDropdown
          align="end"
          autoClose="outside"
          eventkey={this.props.notificationNumber}
          title={
            <span classname="navbar-notification-span">
              <i className="fa fa-bell"></i>
              {this.props.notificationNumber !== 0 && (
                <span className="navbar-notification-number">
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
            <div className="dropdown-notification">
              {notifications !== null && notifications.length !== 0 ? (
                <NavDropdown.ItemText>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={this.props.removeAllNotifications}
                  >
                    mark all as read
                  </Button>
                </NavDropdown.ItemText>
              ) : (
                <NavDropdown.ItemText className="dropdown-text">
                  <BallRunningDots loading={true} color="#000" center />
                </NavDropdown.ItemText>
              )}

              <NavDropdown.Divider />
              {this.getAllNotificationDropDownItem(notifications)}
              {notifications !== null &&
                notifications.length !== 0 &&
                this.props.notificationLoading && (
                  <NavDropdown.ItemText className="dropdown-text">
                    <BallRunningDots loading={true} color="#000" center />
                  </NavDropdown.ItemText>
                )}
            </div>
          )}
        </NavDropdown>
        <NavDropdown
          align="end"
          eventkey={8}
          title={
            <span>
              {this.props.user && this.props.user.icon ? (
                <i className={this.props.user.icon} />
              ) : (
                <i className="fa fa-user fa-fw" />
              )}
              <span className="nav-bar-username">
                {this.props.user.first_name.length > 15 ? 
                  this.props.user.first_name.substring(0, 15) + "..." :
                  this.props.user.first_name}
              </span>
            </span>
          }
          id="collasible-nav-dropdown"
        >
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Item href="/searchUser">Search</NavDropdown.Item>
          <NavDropdown.Item href="/calendar">Calendar</NavDropdown.Item>
          <NavDropdown.Item href="/email" className="navdropdown-email">
            Email
          </NavDropdown.Item>

          <NavDropdown.Item href="/setting">Edit Profile</NavDropdown.Item>
          <NavDropdown.Item href="/changeIcon">Change Icon</NavDropdown.Item>
          <NavDropdown.Item
            href="/setting/change-password"
            className="navdropdown-change-password"
          >
            Change Password
          </NavDropdown.Item>
          <NavDropdown.Item
            href="/login"
            onClick={this.props.onLogOut}
            style={{ color: "red" }}
          >
            LogOut
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    );
  }

  // logIn() {
  //   let notifications = JSON.parse(localStorage.getItem("notifications"));
  //   return (
  //     <Nav>
  //       <Nav.Link href="/profile" className={"navbar_nav"}>
  //         {this.props.user && this.props.user.icon ? (
  //           <i className={this.props.user.icon}></i>
  //         ) : (
  //           <i className="fa fa-user fa-fw"></i>
  //         )}

  //         {this.props.user.first_name}
  //       </Nav.Link>
  //       <Nav.Link href="/contact" className={"navbar_nav"}>
  //         <i className="fa fa-user-friends"></i>
  //         Contacts
  //       </Nav.Link>
  //       <Nav.Link href="/searchUser" className={"navbar_nav"}>
  //         <i className="fa fa-search"></i>
  //         Search
  //       </Nav.Link>

  //       <NavDropdown
  //         autoClose="outside"
  //         eventkey={this.props.notificationNumber}
  //         title={
  //           <span>
  //             <i className="fa fa-rocket"></i>
  //             Inbox
  //             {this.props.notificationNumber !== 0 && (
  //               <span className="badge badge-warning notification-badge">
  //                 {" "}
  //                 {this.props.notificationNumber}{" "}
  //               </span>
  //             )}
  //           </span>
  //         }
  //         id="basic-nav-dropdown"
  //         onClick={this.props.onGetNotification}
  //       >
  //         {this.props.notificationNumber === 0 ? (
  //           <NavDropdown.ItemText className="dropdown-text">
  //             No new message
  //           </NavDropdown.ItemText>
  //         ) : (
  //           <div className="dropdown-notification">
  //             {notifications !== null && notifications.length !== 0 ? (
  //               <NavDropdown.ItemText>
  //                 <Button
  //                   variant="outline-danger"
  //                   size="sm"
  //                   onClick={this.props.removeAllNotifications}
  //                 >
  //                   mark all as read
  //                 </Button>
  //               </NavDropdown.ItemText>
  //             ) : (
  //               <NavDropdown.ItemText className="dropdown-text">
  //                 <BallRunningDots loading={true} color="#000" center />
  //               </NavDropdown.ItemText>
  //             )}

  //             <NavDropdown.Divider />
  //             {this.getAllNotificationDropDownItem(notifications)}
  //             {notifications !== null &&
  //               notifications.length !== 0 &&
  //               this.props.notificationLoading && (
  //                 <NavDropdown.ItemText className="dropdown-text">
  //                   <BallRunningDots loading={true} color="#000" center />
  //                 </NavDropdown.ItemText>
  //               )}
  //           </div>
  //         )}
  //       </NavDropdown>
  //       <Nav.Link href="/email" className={"navbar_nav"}>
  //         <i className="fa fa-mail-bulk"></i>
  //         Email
  //       </Nav.Link>
  //       <Nav.Link href="/chat" className={"navbar_nav"}>
  //         Chat
  //       </Nav.Link>
  //       <Nav.Link className={"navbar_nav"} onClick={this.props.onLogOut}>
  //         LogOut
  //       </Nav.Link>
  //       <NavDropdown
  //         eventkey={3}
  //         title={
  //           <span>
  //             <i className="fas fa-cog"></i> Setting
  //           </span>
  //         }
  //         id="collasible-nav-dropdown"
  //       >
  //         <NavDropdown.Item href="/profile">
  //           <i className="fa fa-user fa-fw"></i>
  //           {this.props.user.first_name}
  //         </NavDropdown.Item>
  //         <NavDropdown.Item href="/contact">
  //           <i className="fa fa-user-friends"></i>
  //           Contacts
  //         </NavDropdown.Item>
  //         <NavDropdown.Item href="/setting">
  //           <i className="fas fa-cog"></i> Setting
  //         </NavDropdown.Item>

  //         <NavDropdown.Divider />
  //         <NavDropdown.Item href="/login" onClick={this.props.onLogOut}>
  //           LogOut
  //         </NavDropdown.Item>
  //       </NavDropdown>
  //     </Nav>
  //   );
  // }

  notLogIn() {
    return (
      <Nav>
        <Nav.Link href="/signup" className={"navbar_nav"}>
          <i className="fas fa-user-plus"></i> Register
        </Nav.Link>
        <Nav.Link href="/login" className={"navbar_nav"}>
          <i className="fas fa-sign-in-alt"></i> Login
        </Nav.Link>
      </Nav>
    );
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" className="nav-bar-78">
        <Container>
          {this.props.user && this.props.basic ? (
            <Navbar.Brand href="/dashboard">CandHCRM</Navbar.Brand>
          ) : (
            <Navbar.Brand href="/">CandHCRM</Navbar.Brand>
          )}
          {this.props.user && this.props.basic ? this.logIn() : this.notLogIn()}
        </Container>
      </Navbar>
    );
  }
}

export default NavigationBar;
