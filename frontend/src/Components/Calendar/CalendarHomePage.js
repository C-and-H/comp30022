/*
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/components/profile.component.js
*/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import CalendarSidebar from "./CalendarSidebar"
import SetEvent from "./SetEvent";
import Calendar from "./calendar";
import {Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Height } from "@material-ui/icons";

export default class CalendarHomePage extends Component {
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

    const { currentUser } = this.state;

    return (
      <div className="container">
        {this.state.userReady ? (
        <div>
          <h1 style={{marginTop:40, marginLeft:0, marginBottom:40}}>Here is your Calendar!</h1>
          <Row>
          <Router>
            <Col xs="3" style={{textAlign:"center"}}>
              <CalendarSidebar/>
            </Col>
            <Col xs="9"  style={{textAlign:"center" }}>
              <Switch>
              <Route exact path = "/calendar2" component = {Calendar} />
              <Route exact path = "/setEvent" component = {SetEvent} />
              </Switch>
            </Col>
          </Router>
          </Row>
          </div>
        ) : null}
      </div>
    );
  }
}
