import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_URL } from "../constant";
import Picker from "emoji-picker-react";
import moment from "moment";

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
        ["10:10 2222/22/22", "r", "me"],
        ["10:09", "random message", "friend"],
        [
          "10:02",
          "some loooooooooooooooooooooooooooooooooooog loooooooooooooooooooooooooooooooooooog loooooooooooooooooooooooooooooooooooog message",
          "friend",
        ],
        ["10:01", "random message", "me"],
        ["09:10", "random message", "me"],
        ["08:10", "random message", "me"],
        ["07:10", "random message", "me"],
        ["06:10", "random message", "me"],
      ],
      isLoading: false,
      friendList: [
        {
          id: "6124e4e79e3dd74065e23e51",
          name: "User One",
          email: "1@1.cn",
          message: "some recent message",
          time: "10:00",
          unread: 30,
        },
        {
          id: "6124e53b9e3dd74065e23e55",
          name: "User Two",
          email: "2@2.cn",
          message: "some recent looooooooooooooooooooooooog message",
          time: "9:00",
          unread: 1,
        },
        {
          id: "6124e5229e3dd74065e23e54",
          name: "User Three",
          email: "3@3.cn",
          message: "some recent message",
          time: "8:00",
          unread: 200,
        },
      ],
      searchList: null,
      emojiVisible: false,
      isSending: false,
    };

    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.onChatScroll = this.onChatScroll.bind(this);
    this.onEmojiClick = this.onEmojiClick.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    if (!this.state.basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    }
    this.fetchFriendList();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  friendList() {
    const { friendList, searchList } = this.state;
    return (
      <div className="div-chat-friendList">
        <div className="div-chat-friendList-header"></div>
        <input
          type="text"
          placeholder="Search"
          className="search-contact"
          name="search"
          onChange={this.handleChangeSearch}
        />
        {searchList ? (
          searchList.length === 0 ? (
            <h1>None match</h1>
          ) : (
            searchList.map((friend) => this.friendDisplay(friend))
          )
        ) : (
          friendList.map((friend) => this.friendDisplay(friend))
        )}
      </div>
    );
  }

  friendDisplay(friend) {
    return (
      <div key={friend.id}>
        <Button
          className="btn-chat-friend"
          variant="outline-dark"
          size="lg"
          onClick={() => this.onClickFriend(friend)}
        >
          {friend.icon ? (
            <i className={friend.icon + " fa-2x chat-friendList-icon"} />
          ) : (
            <i className="fa fa-user fa-fw fa-2x chat-friendList-icon" />
          )}
          {friend.unread > 0 &&
            (friend.unread < 99 ? (
              friend.unread > 9 ? (
                <div className="div-unread-message-10">{friend.unread}</div>
              ) : (
                <div className="div-unread-message">{friend.unread}</div>
              )
            ) : (
              <div className="div-unread-message-99">99+</div>
            ))}
          <div className="div-chat-friendList-top">
            <div className="div-chat-friendList-name">{friend.name}</div>
            <div className="div-chat-friendList-time">{friend.time}</div>
          </div>
          <div className="div-chat-friendList-recent-message">
            {friend.message}
          </div>
        </Button>
      </div>
    );
  }

  async fetchFriendList() {
    const { basic } = this.state;
    const response = await axios.get(API_URL + "/chat/overview", {
      headers: {
        Authorization: "Bearer " + basic.token,
      },
    });

    if (response.data) {
      console.log(response.data);
    }
  }

  /**
   * automatically search when user enter or delete something
   */
  handleChangeSearch(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ searchList: null });
    } else {
      this.matchContacts(event.target.value);
    }
  }

  matchContacts(key) {
    const { friendList } = this.state;
    if (friendList.length > 0) {
      try {
        const search = new RegExp(key, "i");
        let searchList = [];
        for (let i = 0; i < friendList.length; i++) {
          if (search.test(friendList[i].name)) {
            searchList.push(friendList[i]);
            continue;
          }
        }
        this._isMounted && this.setState({ searchList });
      } catch (e) {
        this._isMounted && this.setState({ searchList: [] });
      }
    }
  }

  handleChangeText(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ textEnter: "" });
    } else {
      this._isMounted && this.setState({ textEnter: event.target.value });
    }
  }

  handleVisibleChange() {
    this.setState({ emojiVisible: !this.state.emojiVisible });
  }

  async onClickFriend(friend) {
    await this.setState({ friend, emojiVisible: false, textEnter: "" });
    await this.fetchChatHistory();
    let chatDisplay = document.getElementById("chat-display");
    this._isMounted &&
      chatDisplay &&
      chatDisplay.addEventListener("mousewheel", this.onChatScroll, false);
  }

  emojiList() {
    return (
      <div className="div-emoji-list">
        <Picker onEmojiClick={this.onEmojiClick} />
      </div>
    );
  }

  onEmojiClick(event, emojiObject) {
    this.setState({ textEnter: this.state.textEnter + emojiObject.emoji });
  }

  emojiButton() {
    return (
      <Button
        appearance="subtle"
        className="btn-emoji"
        onClick={this.handleVisibleChange}
      >
        😀
      </Button>
    );
  }

  chatBox() {
    const { textEnter, emojiVisible, friend, isSending } = this.state;
    return (
      <div className="div-chat-box">
        <div className="div-chat-opponent">
          {friend.name}
          <Button
            className="btn-close-chat"
            onClick={() => {
              this.setState({ friend: null });
            }}
          >
            <i className="fa fa-times" />
          </Button>
        </div>
        {friend && this.chatDisplay()}
        {emojiVisible && this.emojiList()}
        {this.emojiButton()}
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
        <Button
          disabled={textEnter === "" || isSending}
          className="btn-send-text"
          onClick={() => this.sendText()}
        >
          Send
        </Button>
      </div>
    );
  }

  chatDisplay() {
    const { message, isLoading } = this.state;
    return (
      <div id="chat-display" className="div-chat-display">
        {message &&
          message.length > 0 &&
          message.map((message) => this.messageDisplay(message))}
        {isLoading ? (
          <div className="div-loading-top">loading...</div>
        ) : (
          <div className="div-loading-nothing">.</div>
        )}
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
      <div key={message} className="div-chat-message">
        {friend && friend.icon ? (
          <i className={friend.icon + " fa-2x chat-friend-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-friend-icon" />
        )}
        <div className="div-message-received">
          <div className="div-time-label-received">{message[0]}</div>
          {message[1]}
        </div>
      </div>
    );
  }

  messageSentDisplay(message) {
    const { currentUser } = this.state;
    return (
      <div key={message} className="div-chat-message">
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

  async fetchChatHistory() {
    const { basic, friend } = this.state;
    const response = await axios.post(
      API_URL + "/chat/fetch",
      { id: friend.id, until: moment().format("YYYY-MM-DD HH:mm:ss") },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      console.log(response.data);
    }
  }

  async sendText() {
    const { basic, friend, textEnter } = this.state;
    this.setState({ isSending: true });
    const response = await axios.post(
      API_URL + "/chat/sendText",
      { id: friend.id, message: textEnter },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      console.log(response.data);
      this.setState({ textEnter: "" });
    }

    this.setState({ isSending: false });
  }

  async onChatScroll(event) {
    if (event.wheelDelta > 0) {
      let chatDisplay = document.getElementById("chat-display");
      if (
        !this.state.isLoading &&
        chatDisplay &&
        chatDisplay.clientHeight -
          chatDisplay.scrollHeight -
          chatDisplay.scrollTop ===
          0
      ) {
        this.setState({ isLoading: true });
        const { basic } = this.state;

        // simulate time for get backend data
        await axios.get(API_URL + "/friend/listFriends", {
          headers: {
            Authorization: "Bearer " + basic.token,
          },
        });

        let message = this.state.message;
        message.push(["05:10", "addition message", "friend"]);
        message.push(["04:10", "addition message", "friend"]);
        message.push(["04:08", "addition message", "friend"]);
        message.push(["04:09", "addition message", "friend"]);
        message.push(["04:00", "addition message", "friend"]);
        message.push(["04:00", "addition message", "me"]);
        this.setState({ isLoading: false, message });
      }
    }
  }

  render() {
    const { friend } = this.state;
    return (
      <div>
        {this.friendList()}
        {friend && this.chatBox()}
      </div>
    );
  }
}

export default Chat;
