import "./App.css";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import { HashRouter } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Profile from "./Components/Profiles/UserProfile";
import BoardUser from "./Components/BoardUser";
import AuthService from "./Services/AuthService";
import Verify from "./Components/Verify";
import ContactList from "./Components/contactList";

// const API_URL = "https://crm-c-and-h-backend.herokuapp.com"
const API_URL = "http://localhost:8080";

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get(API_URL + "/findAllUsers").then((res) => {
      console.log(res);
      // data comes from res.data can be found from 'inspect'
      const data = res.data;
      setUserProfiles(data);
      console.log("bruh");
    });
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);
  // user profile is set by setUserProfiles line 14
  return userProfiles.map((userProfiles, index) => {
    return (
      // key is unique
      <div key={index}>
        <center>
          <h1>{userProfiles.id}</h1>
        </center>
      </div>
    );
  });
};

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
    const basic = AuthService.getBasicInfo();

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
          <NavigationBar user = {currentUser} onLogOut = {this.handleLogOut} />
          <Switch>
            
            <Route exact path = "/signup" component = {SignUp} />
            <Route path = "/login" component = {LogIn} />
            <Route exact path = "/contact" component = {ContactList} />
            <Route exact path = "/profile" component = {Profile} />
            <Route path = "/user" component = {BoardUser} />
            <Route exact path = {["/", "/home"]} component = {HomePage} />
            <Route path = "/signup/:email/:code">
              <Verify />
            </Route>
            <Route path = "/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}


export default App;
