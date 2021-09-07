import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Profile from "./Components/Profiles/UserProfile";
import BoardUser from "./Components/BoardUser";
import AuthService from "./Services/AuthService";
import Verify from "./Components/Verify";
import ContactList from "./Components/contactList";
import SearchUser from "./Components/searchUser";
import OtherUser from "./Components/otherUser";
import FriendUser from "./Components/friendProfile";

class App extends Component {
  constructor(props) {
    super(props);
    //this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: JSON.parse(localStorage.getItem("user")),
      basic: JSON.parse(localStorage.getItem("basic")),
    };
  }

  async componentDidMount() {
    let basic = AuthService.getBasicInfo();
    if (basic) {
      await AuthService.validToken(basic.token);
      basic = AuthService.getBasicInfo();
      if (!basic) {
        this.setState({ basic: null, currentUser: null });
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
    const { currentUser } = this.state;
    return (
      <div className="App">
        <Router>
          <NavigationBar user={currentUser} onLogOut={this.handleLogOut} />
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path="/friend/:id" component={FriendUser} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path={["/", "/home"]} component={HomePage} />
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
