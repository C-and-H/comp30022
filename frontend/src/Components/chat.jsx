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
    return <div className="div-chat-display"></div>;
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
