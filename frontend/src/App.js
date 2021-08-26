import "./App.css";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./Components/SignUp";
import { HashRouter } from "react-router-dom";
import Footer from "./Components/pageFooter";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Profile from "./Components/UserProfile";
import BoardUser from "./Components/BoardUser";
import AuthService from "./Services/AuthService";

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
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div className="App">
        <Router>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              bezKoder
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {showModeratorBoard && (
                <li className="nav-item">
                  <Link to={"/mod"} className="nav-link">
                    Moderator Board
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user"} className="nav-link">
                    User
                  </Link>
                </li>
              )}
            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/signup"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>

          <NavigationBar />
          <Switch>
            <Route path="/signup">
              <SignUp />
              {/* <UserProfiles/> */}
            </Route>
            <Route path="/login">
              <LogIn />
            </Route>

            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route exact path={["/", "/home"]} component={HomePage} />

            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
        {/* <HomePage/> */}
        {/* <Footer/> */}
      </div>
    );
  }
}

function Home() {
  return (
    <HashRouter>
      <div>
        <UserProfiles />
      </div>
    </HashRouter>
  );
}

export default App;
