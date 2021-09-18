import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "react-bootstrap/Button";

class Chat extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      textEnter: "",
      friend: null,
      // time, message, sender
      message: [
        ["10:10", "random message", "me"],
        ["10:09", "random message", "friend"],
        [
          "10:02",
          "some loooooooooooooooooooooooooooooooooooog loooooooooooooooooooooooooooooooooooog loooooooooooooooooooooooooooooooooooog message",
          "friend",
        ],
        ["10:10", "random message", "me"],
        ["10:10", "random message", "me"],
        ["10:10", "random message", "me"],
        ["10:10", "random message", "me"],
        ["10:10", "random message", "me"],
      ],
    };

    this.handleChangeText = this.handleChangeText.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this.state.basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  friendList() {
    return (
      <div className="div-chat-friendList">
        <div className="div-chat-friendList-header"></div>
        <input
          type="text"
          placeholder="Search"
          className="search-contact"
          name="search"
          //onChange={this.handleChange}
        />
      </div>
    );
  }

  handleChangeText(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ textEnter: "" });
    } else {
      this._isMounted && this.setState({ textEnter: event.target.value });
    }
  }

  chatBox() {
    const { textEnter } = this.state;
    return (
      <div className="div-chat-box">
        {this.chatDisplay()}
        <div className="div-text-enter ">
          <TextField
            id="text-enter"
            multiline
            variant="outlined"
            className="text-enter"
            rows={5}
            value={textEnter}
            onChange={this.handleChangeText}
          />
        </div>
        <Button className="btn-send-text">Send</Button>
      </div>
    );
  }

  chatDisplay() {
    const { message } = this.state;
    return (
      <div className="div-chat-display">
        {message &&
          message.length > 0 &&
          message.map((message) => this.messageDisplay(message))}
      </div>
    );
  }

  messageDisplay(message) {
    if (message[2] === "me") {
      return this.messageSentDisplay(message);
    }
    return this.messageReceivedDisplay(message);
  }

  messageReceivedDisplay(message) {
    const { friend } = this.state;
    return (
      <div className="div-chat-message">
        {friend && friend.icon ? (
          <i className={friend.icon + " fa-2x chat-friend-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-friend-icon" />
        )}
        <p className="div-message-received">
          <div className="div-time-label-received">{message[0]}</div>
          {message[1]}
        </p>
      </div>
    );
  }

  messageSentDisplay(message) {
    const { currentUser } = this.state;
    return (
      <div className="div-chat-message">
        {currentUser && currentUser.icon ? (
          <i className={currentUser.icon + " fa-2x chat-my-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-my-icon" />
        )}
        <div className="div-message-sent">
          <div className="div-time-label-sent">{message[0]}</div>
          {message[1]}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.friendList()}
        {this.chatBox()}
      </div>
    );
  }
}

export default Chat;
