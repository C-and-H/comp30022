/*
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/components/profile.component.js
*/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import ProfileSideBar from "./ProfileSideBar"
import {Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChangePassword from './ChangePassword'
import ProfileDisplay from "./ProfileDisplay";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: localStorage.getItem("user"),
      basic: localStorage.getItem("basic")
    };
  }

  // if current user is null, will go back to homepage
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    // if not login
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });
    // console.log(this.state.currentUser, this.state.basic)
  }

  render() {
    // if redict is not null imply user is not login, then go to home page
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser, basic } = this.state;

    return (
      <div className="container">
        {this.state.userReady ? (
        <div>
          <h1 style={{marginTop:40, marginLeft:0, marginBottom:40}}>Welcome back, {currentUser.first_name}!</h1>
          <Row>
          <Router>
            <Col xs="4" style={{textAlign:"center"}}>.col-4
              <ProfileSideBar/>
            </Col>
            <Col xs="8" style={{textAlign:"center"}}>.col-8
              <Switch>
              <Route exact path = "/profile/change-password" component = {ChangePassword} />
              </Switch>
              <Switch>
                <Route exact path = "/profile" component = {ProfileDisplay} />
              </Switch>
            </Col>
          </Router>
          </Row>
            
            
              {/* <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3> */}


            {/* <p>
              <strong>Token:</strong> 
              {basic.token.substr(basic.token.length - 20)}
            </p> */}
            {/* <p>
              <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p> */}
            {/* <strong>Authorities:</strong> */}
            {/* <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
            </ul> */}
            
          </div>
        ) : null}
      </div>
    );
  }
}
