import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_URL } from "../constant";
import Picker from "emoji-picker-react";
import { Redirect } from "react-router-dom";
import moment from "moment";
// https://52kpm06q2k.codesandbox.io for loading effects
import {
  BallRunningDots,
  BallClipRotate,
  BallPulse,
  BallFussion,
} from "react-pretty-loading";

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
      message: [],
      isLoading: false,
      friendList: null,
      searchList: null,
      emojiVisible: false,
      isSending: false,
      messageSending: "",
      isReceiving: false,
      chat: 2,
      redirect: null,
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
      this.setState({ redirect: "/" });
    } else {
      this.props.onChat();
      await this.fetchFriendList();
      if (localStorage.getItem("chat")) {
        this._isMounted &&
          this.onClickFriend(JSON.parse(localStorage.getItem("chat")));
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    localStorage.removeItem("chat");
  }

  async componentDidUpdate() {
    if (this.props.chat > this.state.chat) {
      this._isMounted && this.setState({ chat: this.props.chat });
      await this.fetchFriendList();
      const { friendList, friend } = this.state;
      if (friend) {
        for (let i = 0; i < friendList.length; i++) {
          if (friendList[i].id === friend.id) {
            if (friendList[i].unread > 0) {
              this.fetchNewMessage();
            }
            break;
          }
        }
      }
    }
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
        {friendList ? (
          searchList ? (
            searchList.length === 0 ? (
              <h1>None match</h1>
            ) : (
              searchList.map((friend) => this.friendDisplay(friend))
            )
          ) : (
            friendList.map((friend) => this.friendDisplay(friend))
          )
        ) : (
          <BallFussion loading={true} color="#000" center />
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
          {friend.icon && friend.icon !== "" ? (
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
            <div className="div-chat-friendList-time">
              {new Date(friend.time).toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
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
      this._isMounted && this.setState({ friendList: response.data });
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
    if (friend !== this.state.friend) {
      await (this._isMounted &&
        this.setState({
          friend,
          emojiVisible: false,
          textEnter: "",
          message: [],
        }));
      await this.fetchChatHistory();
      let chatDisplay = document.getElementById("chat-display");
      this._isMounted &&
        chatDisplay &&
        chatDisplay.addEventListener("mousewheel", this.onChatScroll, false);
      localStorage.removeItem("chat");
    }
  }

  emojiList() {
    return (
      <div className="div-emoji-list">
        <Picker onEmojiClick={this.onEmojiClick} />
      </div>
    );
  }

  onEmojiClick(event, emojiObject) {
    this._isMounted &&
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
              this._isMounted && this.setState({ friend: null });
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
    const { message, isLoading, isSending, isReceiving } = this.state;
    return (
      <div id="chat-display" className="div-chat-display">
        {isReceiving && this.messageReceiving()}
        {isSending && this.messageSending()}
        {message &&
          message.length > 0 &&
          message.map((message) => this.messageDisplay(message))}
        {isLoading ? (
          <div className="div-loading-top">
            <BallRunningDots loading={true} color="#000" center />
          </div>
        ) : (
          <div className="div-loading-nothing">.</div>
        )}
      </div>
    );
  }

  messageDisplay(message) {
    if (message.senderId === this.state.basic.id) {
      return this.messageSentDisplay(message);
    }
    return this.messageReceivedDisplay(message);
  }

  messageReceivedDisplay(message) {
    const { friend } = this.state;
    return (
      <div key={message.when} className="div-chat-message">
        {friend && friend.icon ? (
          <i className={friend.icon + " fa-2x chat-friend-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-friend-icon" />
        )}
        <div className="div-message-received">
          <div className="div-time-label-received">
            {new Date(message.when).toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="div-message-on-top">{message.message}</div>
        </div>
      </div>
    );
  }

  messageSentDisplay(message) {
    const { currentUser } = this.state;
    return (
      <div key={message.when} className="div-chat-message">
        {currentUser && currentUser.icon ? (
          <i className={currentUser.icon + " fa-2x chat-my-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-my-icon" />
        )}
        <div className="div-message-sent">
          <div className="div-time-label-sent">
            {new Date(message.when).toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="div-message-on-top">{message.message}</div>
        </div>
      </div>
    );
  }

  async fetchChatHistory() {
    const { basic, friend } = this.state;
    this._isMounted && this.setState({ isLoading: true });
    const response = await axios.post(
      API_URL + "/chat/fetch",
      { id: friend.id, until: moment().toISOString() },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      const { friendList } = this.state;
      for (let i = 0; i < friendList.length; i++) {
        if (friendList[i].id === friend.id) {
          friendList[i].unread = 0;
          break;
        }
      }
      this._isMounted && this.setState({ message: response.data, friendList });
    }
    this._isMounted && this.setState({ isLoading: false });
  }

  async fetchNewMessage() {
    const { basic, friend } = this.state;
    this._isMounted && this.setState({ isReceiving: true });
    const response = await axios.post(
      API_URL + "/chat/fetchNew",
      { id: friend.id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      const { friendList, message } = this.state;
      for (let i = 0; i < friendList.length; i++) {
        if (friendList[i].id === friend.id) {
          friendList[i].unread = 0;
          break;
        }
      }

      for (let i = response.data.length - 1; i >= 0; i--) {
        message.unshift(response.data[i]);
      }
      this._isMounted && this.setState({ message, friendList });
    }
    this._isMounted && this.setState({ isReceiving: false });
  }

  async sendText() {
    const { basic, friend } = this.state;
    const text = this.state.textEnter;
    const time = moment().toISOString();
    this._isMounted &&
      this.setState({ isSending: true, textEnter: "", messageSending: text });
    const response = await axios.post(
      API_URL + "/chat/sendText",
      { id: friend.id, message: text },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data && response.data === "Message Sent.") {
      const { message, friendList } = this.state;
      message.unshift({
        senderId: basic.id,
        message: text,
        when: time,
      });

      for (let i = 0; i < friendList.length; i++) {
        if (friendList[i].id === friend.id) {
          friendList[i].message = text;
          friendList[i].time = time;
          break;
        }
      }
      friendList.sort(function (a, b) {
        var date1 = new Date(a.time);
        var date2 = new Date(b.time);
        return date1.getTime() < date2.getTime();
      });
      this._isMounted && this.setState({ message, friendList });
    } else {
      alert("Failed to sent message.");
    }

    this._isMounted && this.setState({ isSending: false, messageSending: "" });
  }

  messageSending() {
    const { currentUser, messageSending } = this.state;
    return (
      <div className="div-chat-message">
        {currentUser && currentUser.icon ? (
          <i className={currentUser.icon + " fa-2x chat-my-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-my-icon" />
        )}
        <div className="div-message-sent">
          <div className="div-time-label-sent">
            {new Date(moment().toISOString()).toLocaleDateString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="div-message-on-top">{messageSending}</div>
        </div>
        <div className="loading-send">
          <BallClipRotate loading={true} color="#000" />
        </div>
      </div>
    );
  }

  messageReceiving() {
    const { friend } = this.state;
    return (
      <div className="div-chat-message">
        {friend && friend.icon ? (
          <i className={friend.icon + " fa-2x chat-friend-icon"} />
        ) : (
          <i className="fas fa-user fa-2x chat-friend-icon" />
        )}
        <div className="div-message-received">
          <BallPulse loading={true} color="#000" center />
        </div>
      </div>
    );
  }

  async onChatScroll(event) {
    if (event.wheelDelta > 0) {
      let chatDisplay = document.getElementById("chat-display");
      if (
        !this.state.isLoading &&
        chatDisplay &&
        chatDisplay.clientHeight -
          chatDisplay.scrollHeight -
          chatDisplay.scrollTop >=
          -2
      ) {
        this._isMounted && this.setState({ isLoading: true });
        const { basic, friend, message } = this.state;

        if (message.length > 0) {
          const response = await axios.post(
            API_URL + "/chat/fetch",
            { id: friend.id, until: message[message.length - 1].when },
            {
              headers: {
                Authorization: "Bearer " + basic.token,
              },
            }
          );

          if (response.data) {
            for (let i = 0; i < response.data.length; i++) {
              message.push(response.data[i]);
            }
            this._isMounted && this.setState({ message });
          }
        } else {
          const response = await axios.post(
            API_URL + "/chat/fetch",
            { id: friend.id, until: moment().toISOString() },
            {
              headers: {
                Authorization: "Bearer " + basic.token,
              },
            }
          );

          if (response.data) {
            this._isMounted && this.setState({ message: response.data });
          }
        }
        this._isMounted && this.setState({ isLoading: false });
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
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
