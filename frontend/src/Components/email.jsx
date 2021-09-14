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
      toEmails: [],
      email: "",
      fromName: JSON.parse(localStorage.getItem("user")).name,
    };

    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSender = this.handleChangeSender.bind(this);
    this.handleChangeReceiver = this.handleChangeReceiver.bind(this);
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

  handleChangeSender(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ fromName: "" });
    } else {
      this._isMounted && this.setState({ fromName: event.target.value });
    }
  }

  handleChangeReceiver(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ email: "" });
    } else {
      this._isMounted && this.setState({ email: event.target.value });
    }
  }

  mailContent() {
    const { mailBody, mailTitle } = this.state;
    return (
      <div className="div-mail">
        <div className="div-mail-title">
          <TextField
            id="mail-title"
            multiline
            required
            variant="outlined"
            label="Mail Title"
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
            label="Mail Content"
            className="mail-body"
            rows={15}
            value={mailBody}
            onChange={this.handleChangeBody}
          />
        </div>
        <Button className="btn-send">Send</Button>
      </div>
    );
  }

  mailInfo() {
    const { toEmails, fromName, email } = this.state;
    return (
      <div className="div-sender">
        <div className="div-mail-title">
          <TextField
            id="mail-from"
            multiline
            required
            variant="outlined"
            label="From Name"
            className="mail-body"
            rows={1}
            value={fromName}
            onChange={this.handleChangeSender}
          />
        </div>
        <div className="div-to-email">
          {toEmails.length === 0 ? (
            <h5>To Emails</h5>
          ) : (
            toEmails.map((email) => this.displayToEmails(email))
          )}
        </div>
        <div className="div-mail-body">
          <TextField
            id="mail-to"
            variant="outlined"
            label="To Email"
            className="mail-email"
            rows={1}
            value={email}
            onChange={this.handleChangeReceiver}
          />
          <Button className="btn-add-email" onClick={() => this.addEmail()}>
            Add
          </Button>
        </div>
      </div>
    );
  }

  addEmail() {
    const { email } = this.state;
    if (!email || email === "") {
      alert("No email entered!");
    } else {
      // same valid email format as backend
      const validEmail = new RegExp(
        "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$"
      );
      if (validEmail.test(email)) {
        let { toEmails } = this.state;
        for (let i = 0; i < toEmails.length; i++) {
          if (toEmails[i] === email) {
            alert("Email already in list");
            return;
          }
        }
        toEmails.push(email);
        this.setState({ toEmails, email: "" });
      } else {
        alert("Email not valid");
      }
    }
  }

  displayToEmails(email) {
    return (
      <div id={email} className="email-display">
        {email}
        <Button onClick={() => this.removeEmail(email)}>
          <i className="fas fa-times" />
        </Button>
      </div>
    );
  }

  removeEmail(email) {
    const { toEmails } = this.state;
    let newEmails = [];
    for (let i = 0; i < toEmails.length; i++) {
      if (toEmails[i] !== email) {
        newEmails.push(toEmails[i]);
      }
    }
    this.setState({ toEmails: newEmails });
  }

  searchEmail() {}

  render() {
    return (
      <div>
        {this.mailContent()}
        {this.mailInfo()}
      </div>
    );
  }
}

export default Email;
