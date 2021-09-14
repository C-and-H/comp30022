import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "react-bootstrap/Button";

class Email extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      mailBody: "",
      mailTitle: "",
    };

    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
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

  handleChangeBody(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ mailBody: "" });
    } else {
      this._isMounted && this.setState({ mailBody: event.target.value });
    }
  }

  handleChangeTitle(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ mailTitle: "" });
    } else {
      this._isMounted && this.setState({ mailTitle: event.target.value });
    }
  }

  render() {
    const { mailBody, mailTitle } = this.state;
    return (
      <div>
        <div className="div-mail">
          <div className="div-mail-title">
            <TextField
              id="mail-title"
              multiline
              required
              variant="outlined"
              label="Mail title"
              className="mail-body"
              maxRows={1}
              value={mailTitle}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div className="div-mail-body">
            <TextField
              id="mail-body"
              multiline
              required
              variant="outlined"
              label="Mail body"
              className="mail-body"
              rows={15}
              value={mailBody}
              onChange={this.handleChangeBody}
            />
          </div>
          <Button className="btn-send">Send</Button>
        </div>
        <div className="div-sender"></div>
      </div>
    );
  }
}

export default Email;
