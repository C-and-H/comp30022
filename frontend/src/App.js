import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components/HomePage";
import LogIn from "./Components/LogIn";
import Setting from "./Components/Profiles/UserProfile";
import ProfileDisplay from "./Components/Profiles/ProfileDisplay";
import SettingProfile from "./Components/Profiles/SettingProfile";
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
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { API_URL } from "./constant";
import axios from "axios";
import SettingNote from "./Components/Profiles/SettingNote";

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
      notificationLoading: false,
      notificationCounter: 0, // help adding unique id to each notification
    };

    this.subscribeCallback = this.subscribeCallback.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.removeAllNotifications = this.removeAllNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
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

    if (basic && !localStorage.getItem("notificationPath")) {
      AuthService.getNotificationPath();
    }

    if (basic && localStorage.getItem("notificationPath")) {
      if (!this.state.isConnected) {
        this.connect(JSON.parse(localStorage.getItem("notificationPath")));
      }
    }
  }

  componentWillUnmount() {
    this.disconnect();
  }

  async handleLogOut() {
    await AuthService.logout();
    this.setState({ redirect: "/" });
    window.location.reload();
  }

  connect(notificationPath) {
    this.setState({ notificationPath: notificationPath });
    var self = this;
    var socket = new SockJS(API_URL + "/candh-crm-websocket");
    self.stompClient = Stomp.over(socket);
    self.stompClient.connect(
      {},
      function (frame) {
        console.log("Connected: ");
        console.log(frame);
        self.setState({ isConnected: true });
        self.stompClient.subscribe(
          "/topic/notification/" + notificationPath,
          self.subscribeCallback
        );
        self.sendUserId();
      }
    );
  }

  subscribeCallback(numNotification) {
    console.log("New push come!");
    console.log(JSON.parse(numNotification.body).count);
    let notifications = localStorage.getItem("notifications");
    if (!notifications) {
      const notificationNumber = JSON.parse(numNotification.body).count;
      this.setState({ notificationNumber: notificationNumber });
    } else {
      console.log(notifications);
      const notificationNumber =
        JSON.parse(numNotification.body).count +
        JSON.parse(notifications).length;
      this.setState({ notificationNumber: notificationNumber });
    }
  }

  sendUserId() {
    console.log("send user id " + AuthService.getBasicInfo().id);
    this.stompClient.send(
      "/app/notification/unread",
      {},
      JSON.stringify({ id: AuthService.getBasicInfo().id })
    );
  }

  disconnect() {
    var self = this;
    if (self.stompClient !== null) {
      self.stompClient.disconnect();
    }
    self.setState({ isConnected: false });
    console.log("Disconnected");
  }

  async getNotifications() {
    this.setState({notificationLoading: true});
    const token = AuthService.getBasicInfo().token;
    const response = await axios.get(API_URL + "/notification/fetch", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    let notifications = localStorage.getItem("notifications");
    if (!notifications) {
      notifications = [];
      for (let i = 0; i < response.data.length; i++) {
        notifications.push({
          id: this.state.notificationCounter,
          ...response.data[i],
        });
        this.setState({
          notificationCounter: this.state.notificationCounter + 1,
        });
      }
    } else {
      notifications = JSON.parse(notifications);
      if (!this.state.notificationCounter) {
        this.setState({ notificationCounter: notifications.length }); // avoid resetting to zero after refresh
      }
      for (let i = 0; i < response.data.length; i++) {
        notifications.push({
          id: this.state.notificationCounter,
          ...response.data[i],
        });
        this.setState({
          notificationCounter: this.state.notificationCounter + 1,
        });
      }
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
    this.setState({ notificationNumber: JSON.parse(localStorage.getItem("notifications")).length, notificationLoading: false });
  }

  removeNotification(notificationID) {
    console.log("Removing notification :" + notificationID);
    let notifications = JSON.parse(localStorage.getItem("notifications"));
    if (notificationID > -1) {
      notifications = notifications.filter(
        (noti) => noti.id !== notificationID
      );
      this.setState({ notificationNumber: this.state.notificationNumber - 1 });
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }

  removeAllNotifications() {
    console.log("Removing All notification");
    localStorage.removeItem("notifications");
    this.setState({ notificationNumber: 0 });
    this.setState({ notificationCounter: 0 });
  }

  render() {
    const { currentUser, redirect, basic, notificationLoading, notificationNumber } = this.state;
    return (
      <div className="App">
        <Router>
          {redirect && <Redirect to={this.state.redirect} />}
          <NavigationBar
            basic={basic}
            user={currentUser}
            onLogOut={this.handleLogOut}
            notificationNumber={notificationNumber}
            onGetNotification={this.getNotifications}
            removeNotification={this.removeNotification}
            removeAllNotifications={this.removeAllNotifications}
            notificationLoading={notificationLoading}
          />
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
            <Route exact path = "/profile/:id" component = {ProfileDisplay} />
            <Route exact path = "/changeIcon" component = {ChangeIcon} />
            <Route exact path="/profile" component={ProfileDisplay} />
            <Route exact path="/settingNote/:id" component={SettingNote} />
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
