import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Setting from "./Components/Profiles/UserProfile";
import ProfileDisplay from "./Components/Profiles/ProfileDisplay";
import AuthService from "./Services/AuthService";
import ChangeIcon from "./Components/Profiles/ChangeIcon";
import Verify from "./Components/Verify";
import ContactList from "./Components/contactList";
import SearchUser from "./Components/searchUser";
import OtherUser from "./Components/otherUser";
import { Redirect } from "react-router-dom";
import Inbox from "./Components/Inbox";
import Email from "./Components/email";
import Chat from "./Components/chat";

class App extends Component {
  constructor(props) {
    super(props);
    //this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: JSON.parse(localStorage.getItem("user")),
      basic: JSON.parse(localStorage.getItem("basic")),
      redirect: null,
    };
  }

  async componentDidMount() {
    let basic = AuthService.getBasicInfo();
    if (basic) {
      await AuthService.validToken(basic.token);
      basic = AuthService.getBasicInfo();
      if (!basic) {
        this.setState({ redirect: "/login", basic: null, currentUser: null });
      }
    }

    if (basic) {
      await AuthService.getUserDataFromBackend(basic.token, basic.id);
      const currentUser = AuthService.getCurrentUser();
      this.setState({ basic, currentUser });
    }
  }

  handleLogOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, redirect } = this.state;
    return (
      <div className="App">
        <Router>
          {redirect && <Redirect to={this.state.redirect} />}
          <NavigationBar user={currentUser} onLogOut={this.handleLogOut} />
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/inbox" component={Inbox} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path={["/", "/home"]} component={HomePage} />
            <Route exact path="/email" component={Email} />
            <Route exact path = "/profile" component = {ProfileDisplay} />
            <Route exact path = "/profile/:id" component = {ProfileDisplay} />
            <Route exact path = "/changeIcon" component = {ChangeIcon} />
            <Route path="/signup/:email/:code">
              <Verify />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
