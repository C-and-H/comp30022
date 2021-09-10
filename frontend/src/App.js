import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Setting from "./Components/Profiles/UserProfile";
import ProfileDisplay from "./Components/Profiles/ProfileDisplay"
import AuthService from "./Services/AuthService";
import Verify from "./Components/Verify";
import ContactList from "./Components/contactList";
import SearchUser from "./Components/searchUser";
import OtherUser from "./Components/otherUser";
import { Redirect } from "react-router-dom";
import Inbox from "./Components/Inbox";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { API_URL } from "./constant";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    //this.logOut = this.logOut.bind(this);
    
    this.state = {
      currentUser: JSON.parse(localStorage.getItem("user")),
      basic: JSON.parse(localStorage.getItem("basic")),
      redirect: null,
      isConnected: false,
      notificationNumber: 0,
      stompClient: null,
      notifications: {}
    };

    this.subscribeCallback = this.subscribeCallback.bind(this);
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

    if (basic) {
      if (!this.state.isConnected) {
        this.connect();
      }
    }
  }

  componentWillUnmount() {
    this.disconnect();
  }

  handleLogOut() {
    AuthService.logout();
  }

  connect() {
    var self = this;
    var socket = new SockJS(API_URL + '/candh-crm-websocket');
    self.stompClient = Stomp.over(socket);
    self.stompClient.connect({id : AuthService.getBasicInfo().id}, function (frame) {
        console.log('Connected: ' );
        console.log(frame);
        self.setState({ isConnected : true});
        self.stompClient.subscribe('/topic/notification', self.subscribeCallback);
        self.sendUserId();
    });
  }

  async subscribeCallback (numNotification) {
    console.log("New push come!");
    console.log(JSON.parse(numNotification.body).count);
    this.setState({ notificationNumber: JSON.parse(numNotification.body).count});

    const token = AuthService.getBasicInfo().token;
    const id = AuthService.getBasicInfo().id;
    const response = await axios.post(
      API_URL + "/notification/fetch",
      {
        id
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

    console.log(response.data);
    this.setState({notifications: response.data});
    console.log("Num notifications: ")
    console.log(this.state.notifications.length);
  }

  sendUserId() {
    console.log("send user id " + AuthService.getBasicInfo().id);
    this.stompClient.send("/app/notification/unread", {}, JSON.stringify({'id': AuthService.getBasicInfo().id}));
  }

  disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect({}, {id : AuthService.getBasicInfo().id});
    }
    this.setState({ isConnected: false });
    console.log("Disconnected");
  }

  render() {
    const { currentUser, redirect } = this.state;
    return (
      <div className="App">
        <Router>
          {redirect && <Redirect to={this.state.redirect} />}
          <NavigationBar user={currentUser} 
            onLogOut={this.handleLogOut} 
            notifications={this.state.notifications} 
            notificationNumber={this.state.notificationNumber}/>
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/inbox" component={Inbox} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path={["/", "/home"]} component={HomePage} />
            <Route exact path = "/profile" component = {ProfileDisplay} />
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
