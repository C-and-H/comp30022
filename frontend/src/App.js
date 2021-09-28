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
import CalendarHomePage from "./Components/Calendar/calendar";
import { Redirect } from "react-router-dom";
import Email from "./Components/email";
import Chat from "./Components/chat";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { API_URL } from "./constant";
import axios from "axios";
import { Notification } from "rsuite";
import Button from "react-bootstrap/Button";
import SettingNote from "./Components/Profiles/SettingNote";
import SetEvent from "./Components/Calendar/SetEvent";
import VideoCall from "./Components/videoCall";

class App extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    // this._chatConnected = false;
    this._notiConnected = false;
    //this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: JSON.parse(localStorage.getItem("user")),
      basic: JSON.parse(localStorage.getItem("basic")),
      redirect: null,
      isConnected: false,
      notificationNumber: 0,
      stompClient: null,
      chatClient: null,
      notificationLoading: false,
      notificationCounter: 0, // help adding unique id to each notification
      onChat: 0,
      chatPath: null,
      onCall: false,
      myVideoStream: null,
      friendVideoStream: null,
    };

    this.subscribeCallback = this.subscribeCallback.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.removeAllNotifications = this.removeAllNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleOnChat = this.handleOnChat.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleMyVideoStream = this.handleMyVideoStream.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    let basic = AuthService.getBasicInfo();
    if (basic) {
      await AuthService.validToken(basic.token);
      basic = AuthService.getBasicInfo();
      if (!basic) {
        this._isMounted &&
          this.setState({ redirect: "/login", basic: null, currentUser: null });
      }
    }

    if (basic) {
      await AuthService.getUserDataFromBackend(basic.token, basic.id);
      const currentUser = AuthService.getCurrentUser();
      this._isMounted && this.setState({ basic, currentUser });
    }

    if (basic && !localStorage.getItem("notificationPath")) {
      await AuthService.getNotificationPath();
    }

    // if (this._isMounted && basic && localStorage.getItem("notificationPath")) {
    //   await this.connectChat(
    //     JSON.parse(localStorage.getItem("notificationPath"))
    //   );
    //   this._chatConnected = true;
    // }

    if (this._isMounted && basic && localStorage.getItem("notificationPath")) {
      if (!this.state.isConnected) {
        await this.connect(
          JSON.parse(localStorage.getItem("notificationPath"))
        );
        this._notiConnected = true;
      }
    }
  }

  componentWillUnmount() {
    this.disconnect();
    this._isMounted = false;
  }

  async handleLogOut() {
    await AuthService.logout();
    this._isMounted && this.setState({ redirect: "/" });
    window.location.reload();
  }

  async connect(notificationPath) {
    this._isMounted && this.setState({ notificationPath: notificationPath });
    var self = this;
    var socket = new SockJS(API_URL + "/candh-crm-websocket");
    self.stompClient = Stomp.over(socket);
    this._isMounted &&
      self.stompClient.connect({}, function (frame) {
        this._isMounted && self.setState({ isConnected: true });
        self.stompClient.subscribe(
          "/topic/chat/" + notificationPath,
          self.handleReceiveMessage
        );
        self.sendUserIdChat();
        self.stompClient.subscribe(
          "/topic/notification/" + notificationPath,
          self.subscribeCallback
        );
        self.sendUserId();
      });
  }

  // async connectChat(notificationPath) {
  //   this._isMounted && this.setState({ chatPath: notificationPath });
  //   var self = this;
  //   var socket = new SockJS(API_URL + "/candh-crm-websocket");
  //   self.chatClient = Stomp.over(socket);
  //   this._isMounted &&
  //     self.chatClient.connect({}, function (frame) {
  //       self.chatClient.subscribe(
  //         "/topic/chat/" + notificationPath,
  //         self.handleReceiveMessage
  //       );
  //       self.sendUserIdChat();
  //     });
  //   console.log("Chat connected", self.chatClient);
  // }

  subscribeCallback(numNotification) {
    let notifications = localStorage.getItem("notifications");
    if (!notifications) {
      const notificationNumber = JSON.parse(numNotification.body).count;
      this._isMounted &&
        this.setState({ notificationNumber: notificationNumber });
    } else {
      const notificationNumber =
        JSON.parse(numNotification.body).count +
        JSON.parse(notifications).length;
      this._isMounted &&
        this.setState({ notificationNumber: notificationNumber });
    }
  }

  sendUserId() {
    this.stompClient.send(
      "/app/notification/unread",
      {},
      JSON.stringify({ id: AuthService.getBasicInfo().id })
    );
  }

  sendUserIdChat() {
    this.stompClient.send(
      "/app/chat/unread",
      {},
      JSON.stringify({ id: AuthService.getBasicInfo().id })
    );
  }

  disconnect() {
    var self = this;
    if (self.stompClient !== null && this._notiConnected) {
      self.stompClient.disconnect();
    }

    // if (self.chatClient !== null && this._chatConnected) {
    //   self.chatClient.disconnect();
    // }
    this._isMounted && self.setState({ isConnected: false });
  }

  async getNotifications() {
    this._isMounted && this.setState({ notificationLoading: true });
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
        this._isMounted &&
          this.setState({
            notificationCounter: this.state.notificationCounter + 1,
          });
      }
    } else {
      notifications = JSON.parse(notifications);
      if (!this.state.notificationCounter) {
        this._isMounted &&
          this.setState({ notificationCounter: notifications.length }); // avoid resetting to zero after refresh
      }
      for (let i = 0; i < response.data.length; i++) {
        notifications.push({
          id: this.state.notificationCounter,
          ...response.data[i],
        });
        this._isMounted &&
          this.setState({
            notificationCounter: this.state.notificationCounter + 1,
          });
      }
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
    this._isMounted &&
      this.setState({
        notificationNumber: JSON.parse(localStorage.getItem("notifications"))
          .length,
        notificationLoading: false,
      });
  }

  removeNotification(notificationID) {
    let notifications = JSON.parse(localStorage.getItem("notifications"));
    if (notificationID > -1) {
      notifications = notifications.filter(
        (noti) => noti.id !== notificationID
      );
      this._isMounted &&
        this.setState({
          notificationNumber: this.state.notificationNumber - 1,
        });
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }

  removeAllNotifications() {
    localStorage.removeItem("notifications");
    this._isMounted && this.setState({ notificationNumber: 0 });
    this._isMounted && this.setState({ notificationCounter: 0 });
  }

  handleOnChat() {
    this._isMounted && this.setState({ onChat: this.state.onChat + 1 });
  }

  handleReceiveMessage(name) {
    if (this.state.onChat) {
      this.handleOnChat();
    } else {
      const from = JSON.parse(name.body).from;
      for (let i = 0; i < from.length; i++) {
        Notification.open({
          title: "",
          duration: 20000,
          description: (
            <div className="div-chat-notification">
              <p>You have received a new message from {from[i]}</p>
              <Button
                className="btn-chat-notification"
                onClick={() => {
                  Notification.closeAll();
                  this.handleOnChat();
                  this._isMounted && this.setState({ redirect: "/chat" });
                }}
              >
                Go
              </Button>
              <Button
                className="btn-chat-notification"
                onClick={() => {
                  Notification.close();
                }}
              >
                Ignore
              </Button>
            </div>
          ),
        });
      }
    }
  }

  handleCall() {
    this.setState({ onCall: !this.state.onCall });
  }

  handleMyVideoStream(stream) {
    this.setState({ myVideoStream: stream });
  }

  render() {
    const {
      currentUser,
      redirect,
      basic,
      notificationLoading,
      notificationNumber,
      onChat,
      onCall,
      friendVideoStream,
    } = this.state;
    return (
      <div className="App">
        <Button onClick={this.handleCall} />
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
          <VideoCall
            visible={onCall}
            endCall={this.handleCall}
            onStream={this.handleMyVideoStream}
            friendVideo={friendVideoStream}
          />
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/setting/change-password" component={Setting} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path="/chat">
              <Chat chat={onChat} onChat={this.handleOnChat} />
            </Route>
            <Route exact path="/email" component={Email} />
            <Route exact path="/profile/:id" component={ProfileDisplay} />
            <Route exact path="/changeIcon" component={ChangeIcon} />
            <Route exact path="/profile" component={ProfileDisplay} />
            <Route exact path="/calendar" component={CalendarHomePage} />
            <Route exact path="/setEvent" component={SetEvent} />

            <Route exact path="/settingNote/:id" component={SettingNote} />

            {/* <Route exact path="/setEvent" component={SetEvent} /> */}
            <Route path="/signup/:email/:code">
              <Verify />
            </Route>
            <Route path={["/", "/home"]} component={HomePage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
