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
      notifications: [],
      notificationCounter: 0 // help adding unique id to each notification
    };

    this.subscribeCallback = this.subscribeCallback.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.removeAllNotifications = this.removeAllNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
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
        this.getNotificationPath();
      }
    }
  }

  async getNotificationPath() {
    const token = AuthService.getBasicInfo().token;
    await axios.get(
      API_URL + "/notification/connect",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then(
      (response) => this.connect(response.data)
    );
  }

  componentWillUnmount() {
    this.disconnect();
  }

  handleLogOut() {
    AuthService.logout();
  }

  connect(notificationPath) {
    console.log("notificationPath: " + notificationPath);
    var self = this;
    var socket = new SockJS(API_URL + "/candh-crm-websocket");
    self.stompClient = Stomp.over(socket);
    self.stompClient.connect(
      { id: AuthService.getBasicInfo().id },
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
      this.setState({ notificationNumber : notificationNumber});
    } else {
      console.log(notifications);
      const notificationNumber =
        JSON.parse(numNotification.body).count +
        JSON.parse(notifications).length;
      this.setState({ notificationNumber : notificationNumber});
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
    if (this.stompClient !== null) {
      this.stompClient.disconnect({}, { id: AuthService.getBasicInfo().id });
    }
    this.setState({ isConnected: false });
    console.log("Disconnected");
  }

  async getNotifications() {
    const token = AuthService.getBasicInfo().token;
    const response = await axios.get(
      API_URL + "/notification/fetch",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log(response.data);
    let notifications = localStorage.getItem("notifications");
    if (!notifications) {
      notifications = [];
      for (let i = 0; i < response.data.length; i++) {
        notifications.push({id:this.state.notificationCounter, ...response.data[i]});
        this.setState({notificationCounter : this.state.notificationCounter+1});
      }
    } else {
      notifications = JSON.parse(notifications);
      if (!this.state.notificationCounter) {
        this.setState({notificationCounter : notifications.length}) // avoid resetting to zero after refresh
      }
      for (let i = 0; i < response.data.length; i++) {
        notifications.push({id:this.state.notificationCounter, ...response.data[i]});
        this.setState({notificationCounter : this.state.notificationCounter+1});
      }
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
    this.setState({ notifications });
    console.log("Num notifications: ");
    console.log(this.state.notifications.length);
    this.setState({ notificationNumber: this.state.notifications.length});
    console.log(response.data);
    console.log("local", JSON.parse(localStorage.getItem("notifications")));
  }

  removeNotification(notificationID) {
    console.log("Removing notification :" + notificationID);
    let notifications = JSON.parse(localStorage.getItem("notifications"));
    if (notificationID > -1) {
      notifications = notifications.filter(noti => noti.id !== notificationID);
      this.setState({notificationNumber : this.state.notificationNumber-1});
    }
    localStorage.setItem("notifications", JSON.stringify(notifications)); 
  }

  removeAllNotifications() {
    console.log("Removing All notification");
    localStorage.removeItem("notifications");
    this.setState({notificationNumber : 0});
    this.setState({notificationCounter : 0})
  }

  render() {
    const { currentUser, redirect } = this.state;
    return (
      <div className="App">
        <Router>
          {redirect && <Redirect to={this.state.redirect} />}
          <NavigationBar
            user={currentUser}
            onLogOut={this.handleLogOut}
            notifications={this.state.notifications}
            notificationNumber={this.state.notificationNumber}
            onGetNotification={this.getNotifications}
            removeNotification={this.removeNotification}
            removeAllNotifications={this.removeAllNotifications}
          />
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/inbox" component={Inbox} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path={["/", "/home"]} component={HomePage} />
            <Route exact path="/profile" component={ProfileDisplay} />
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
