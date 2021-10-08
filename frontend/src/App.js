import "./App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/Register/SignUp";
import NavigationBar from "./Components/NavigationBar";
import HomePage from "./Components//HomePage/HomePage";
import LogIn from "./Components/LogIn/LogIn";
import Setting from "./Components/Setting/SettingProfile";
import ChangePassword from "./Components/Setting/ChangePassword"
import ProfileDisplay from "./Components/Profiles/ProfileDisplay";
import AuthService from "./Services/AuthService";
import ChangeIcon from "./Components/Profiles/ChangeIcon";
import ContactList from "./Components/contactList";
import SearchUser from "./Components/searchUser";
import OtherUser from "./Components/otherUser";
import CalendarHomePage from "./Components/Calendar/calendar";
import { Redirect } from "react-router-dom";
import Email from "./Components/email";
import Chat from "./Components/Chat/chat";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { API_URL } from "./constant";
import axios from "axios";
import { Notification } from "rsuite";
import Button from "react-bootstrap/Button";
import SettingNote from "./Components/Profiles/SettingNote";
import SetEvent from "./Components/Calendar/SetEvent";
import VideoCall from "./Components/Call/videoCall";
import Peer from "simple-peer";
import Loading from "./Logo/loading";
import EmailVerify from "./Components/emailVerify/emailVerify";
import "animate.css";
import Dashboard from "./Components/Dashboard/Dashboard";

class App extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this._notiConnected = false;

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
      myStream: null,
      friendVideoStream: null,
      friendId: "",
      friendName: "",
      peerConnection: null,
      receiveCall: false,
      friendSignal: null,
      onLoading: false,
    };

    this.subscribeCallback = this.subscribeCallback.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.removeAllNotifications = this.removeAllNotifications.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleOnChat = this.handleOnChat.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.startCall = this.startCall.bind(this);
    this.callUser = this.callUser.bind(this);
    this.endCall = this.endCall.bind(this);
    this.handleReceiveCall = this.handleReceiveCall.bind(this);
    this.callAccepted = this.callAccepted.bind(this);
    this.callRejected = this.callRejected.bind(this);
    this.opponentEnded = this.opponentEnded.bind(this);
    this.handleMyVoiceStream = this.handleMyVoiceStream.bind(this);
    this.handleMyStream = this.handleMyStream.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
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
    if (this.state.onCall) {
      this.endCall();
    }
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
          "/topic/othersCallingYou/" + notificationPath,
          self.handleReceiveCall
        );
        self.stompClient.subscribe(
          "/topic/othersAnswering/" + notificationPath,
          self.callAccepted
        );
        self.stompClient.subscribe(
          "/topic/othersReject/" + notificationPath,
          self.callRejected
        );
        self.stompClient.subscribe(
          "/topic/othersEnding/" + notificationPath,
          self.opponentEnded
        );
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
    this.setState({ onChat: this.state.onChat + 1 });
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
            <div className="div-chat-notification animate__animated animate__slideInRight">
              <p className="p-chat-notification">New message from {from[i]}</p>
              <Button
                className="btn-chat-notification btn-outline-info"
                size="sm"
                onClick={() => {
                  Notification.closeAll();
                  this.handleOnChat();
                  this._isMounted && this.setState({ redirect: "/chat" });
                }}
              >
                Go ➜
              </Button>
              <Button
                className="btn-chat-notification-dismiss btn-outline-danger"
                size="sm"
                onClick={() => {
                  Notification.close();
                }}
              >
                Dismiss
              </Button>
            </div>
          ),
        });
      }
    }
  }

  startCall(id) {
    this.setState({ onCall: true, friendId: id });
  }

  callUser(stream) {
    const { currentUser, friendId } = this.state;
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      axios.post(API_URL + "/videoCall/callUser", {
        email: currentUser.email,
        passwordEncoded: currentUser.password,
        id: friendId,
        signal: JSON.stringify(data),
      });
    });

    peer.on("stream", (friendVideoStream) => {
      this.setState({ friendVideoStream });
    });

    this.setState({ peerConnection: peer });
  }

  handleMyVoiceStream(stream) {
    this.setState({ myStream: stream });
    if (this.state.receiveCall) {
      this.answerCall(stream);
    } else {
      this.callUser(stream);
    }
  }

  handleMyStream(stream) {
    this.setState({ myStream: stream });
  }

  handleReceiveCall(call) {
    const message = JSON.parse(call.body);
    if (message.from === this.state.friendId && this.state.onCall) {
      this.state.peerConnection.signal(JSON.parse(message.signal));
    } else {
      Notification.open({
        key: message.from,
        title: "",
        duration: 0,
        description: (
          <div className="div-video-call-notification animate__animated animate__bounceIn">
            <p className="p-video-call-notification">
              <i className="fa fa-phone-alt" />
              {"  " + message.name}
            </p>
            <Button
              className="btn-video-call-notification btn-outline-success"
              onClick={() => {
                Notification.close();
                this._isMounted &&
                  this.setState({
                    receiveCall: true,
                    friendId: message.from,
                    friendName: message.name,
                    friendSignal: JSON.parse(message.signal),
                    onCall: true,
                  });
              }}
            >
              Accept
            </Button>
            <Button
              className="btn-video-call-notification-ignore btn-outline-danger"
              onClick={() => {
                Notification.close();
                axios.post(API_URL + "/videoCall/rejectCall", {
                  email: this.state.currentUser.email,
                  passwordEncoded: this.state.currentUser.password,
                  id: message.from,
                });
              }}
            >
              Ignore
            </Button>
          </div>
        ),
      });
    }
  }

  callAccepted(message) {
    const info = JSON.parse(message.body);
    if (this.state.onCall && this.state.peerConnection) {
      this.state.peerConnection.signal(JSON.parse(info.signal));
      this.setState({ friendName: info.name });
    }
  }

  callRejected(message) {
    const info = JSON.parse(message.body);
    if (this.state.onCall && info.from === this.state.friendId) {
      this.endCall();
      alert("Opponent rejected your call.");
    }
  }

  answerCall(stream) {
    const { currentUser, friendId } = this.state;
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      axios.post(API_URL + "/videoCall/answerCall", {
        email: currentUser.email,
        passwordEncoded: currentUser.password,
        id: friendId,
        signal: JSON.stringify(data),
      });
    });

    peer.on("stream", (friendVideoStream) => {
      this.setState({ friendVideoStream });
    });

    peer.signal(this.state.friendSignal);

    this.setState({ peerConnection: peer });
  }

  opponentEnded(message) {
    const info = JSON.parse(message.body);
    if (this.state.onCall && info.from === this.state.friendId) {
      Notification.open({
        title: "",
        duration: 20000,
        description: (
          <div className="div-video-call-notification">
            <p className="p-video-call-notification">Opponent ends the call.</p>
            <Button
              className="btn-video-end-notification"
              onClick={() => {
                Notification.close();
              }}
            >
              OK
            </Button>
          </div>
        ),
      });
      this.setState({ onCall: false });
      if (this.state.myStream) {
        this.state.myStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (this.state.peerConnection) {
        this.state.peerConnection.destroy();
      }
      this.setState({
        peerConnection: null,
        friendId: "",
        friendName: "",
        friendVideoStream: null,
        myStream: null,
        receiveCall: false,
        friendSignal: null,
      });
    } else {
      try {
        Notification.close(info.from);
      } catch (e) {}
    }
  }

  endCall() {
    this.setState({ onCall: false });
    const { currentUser, friendId } = this.state;
    axios.post(API_URL + "/videoCall/endCall", {
      email: currentUser.email,
      passwordEncoded: currentUser.password,
      id: friendId,
    });

    if (this.state.myStream) {
      this.state.myStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (this.state.peerConnection) {
      this.state.peerConnection.destroy();
    }
    this.setState({
      peerConnection: null,
      friendId: "",
      friendName: "",
      friendVideoStream: null,
      myStream: null,
      receiveCall: false,
      friendSignal: null,
    });
  }

  handleLoading(boolean) {
    this._isMounted && this.setState({ onLoading: boolean });
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
      peerConnection,
      friendName,
      onLoading,
    } = this.state;
    return (
      <div className="div-App-background">
        <Loading visible={onLoading} />
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
            endCall={this.endCall}
            onStream={this.handleMyVoiceStream}
            onSwitch={this.handleMyStream}
            friendVideo={friendVideoStream}
            peer={peerConnection}
            myName={currentUser}
            friendName={friendName}
          />
          <Switch>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/contact" component={ContactList} />
            <Route exact path="/searchUser" component={SearchUser} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/setting/change-password" component={ChangePassword} />
            <Route exact path="/user/:id" component={OtherUser} />
            <Route exact path="/chat">
              <Chat
                chat={onChat}
                onChat={this.handleOnChat}
                onCall={this.startCall}
              />
            </Route>
            <Route exact path="/email" component={Email} />
            <Route exact path="/profile/:id" component={ProfileDisplay} />
            <Route exact path="/changeIcon" component={ChangeIcon} />
            <Route exact path="/profile" component={ProfileDisplay} />
            <Route exact path="/calendar" component={CalendarHomePage} />
            <Route exact path="/setEvent" component={SetEvent} />
            <Route exact path="/settingNote/:id" component={SettingNote} />
            <Route path="/signup/:email/:code" component={EmailVerify} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path={["/", "/home"]} component={HomePage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
