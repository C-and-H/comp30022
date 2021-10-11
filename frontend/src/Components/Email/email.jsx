import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "react-bootstrap/Button";
import { API_URL } from "../../constant";
import axios from "axios";
import "./email.css";

class Email extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this._isEmpty = true;

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      mailBody: "",
      mailTitle: "",
      toEmails: [],
      email: "",
      fromName: "",
      searchEmails: null,
      sending: false,
    };

    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSender = this.handleChangeSender.bind(this);
    this.handleChangeReceiver = this.handleChangeReceiver.bind(this);
  }

  componentDidMount() {
    if (!this.state.basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      this._isMounted = true;
      this._isMounted &&
        this.setState({
          fromName: JSON.parse(localStorage.getItem("user")).name,
        });
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

  /**
   * automatically search when user enter or delete something
   */
  handleChangeReceiver(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ email: "", searchEmails: null });
      this._isEmpty = true;
    } else {
      this._isEmpty = false;
      this._isMounted && this.setState({ email: event.target.value });
      this.searchEmail(event.target.value);
    }
  }

  mailContent() {
    const { toEmails, mailBody, mailTitle, sending, fromName } = this.state;
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
        <div className="div-from-name">
          <TextField
            id="mail-from"
            multiline
            required
            variant="outlined"
            label="From"
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
            id="mail-body"
            multiline
            required
            variant="outlined"
            label="Mail Content"
            className="mail-body"
            rows={10}
            value={mailBody}
            onChange={this.handleChangeBody}
          />
        </div>
        <Button
          className="btn-send"
          onClick={() => this.sendEmail()}
          disabled={sending}
        >
          Send
        </Button>
      </div>
    );
  }

  mailInfo() {
    const { email, searchEmails } = this.state;
    return (
      <div className="div-sender">
        <div className="div-search-to-email">
          <div className="div-to-email-search-box">
          <TextField
            id="mail-to"
            variant="outlined"
            label="To Email"
            className="mail-email"
            rows={1}
            value={email}
            onChange={this.handleChangeReceiver}
          />
          </div>
          <Button className="btn-add-email" onClick={() => this.addEmail()}>
            Add
          </Button>
        </div>
        <div className="div-email-results">
          {searchEmails &&
            (searchEmails.length === 0 ? (
              <h2> None match</h2>
            ) : (
              searchEmails.map((user) => this.displaySearch(user))
            ))}
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
      try {
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
          this._isMounted && this.setState({ toEmails, email: "" });
        } else {
          alert("Email not valid");
        }
      } catch (e) {
        alert("Email not valid");
      }
    }
  }

  displayToEmails(email) {
    return (
      <div key={email} className="email-display">
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
    this._isMounted && this.setState({ toEmails: newEmails });
  }

  async searchEmail(email) {
    const { basic } = this.state;
    const response = await axios.post(
      API_URL + "/user/search",
      {
        id: basic.id,
        email: email,
        first_name: "",
        last_name: "",
        areaOrRegion: "",
        industry: "",
        company: "",
      },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      !this._isEmpty &&
        this._isMounted &&
        this.setState({ searchEmails: response.data });
    }
  }

  displaySearch(user) {
    return (
      <Button
        key={user.id}
        className="btn-searchEmail"
        variant="outline-dark"
        size="lg"
        onClick={() => this.fillEmail(user.email)}
      >
        <i className="fa fa-user-circle fa-fw"></i>
        {" " + user.first_name + " " + user.last_name + " " + user.email}
      </Button>
    );
  }

  fillEmail(email) {
    this._isMounted && this.setState({ email: email });
  }

  async sendEmail() {
    this.setState({ sending: true });
    if (this.validSend()) {
      const { basic, mailBody, mailTitle, toEmails, fromName } = this.state;
      let receiver = "";
      receiver = receiver + toEmails[0];
      if (toEmails.length > 1) {
        for (let i = 1; i < toEmails.length; i++) {
          receiver = receiver + ", " + toEmails[i];
        }
      }
      const response = await axios.post(
        API_URL + "/email/sendEmail",
        {
          receiver: receiver,
          sender: fromName,
          title: mailTitle,
          content: mailBody,
        },
        {
          headers: {
            Authorization: "Bearer " + basic.token,
          },
        }
      );

      if (response.data) {
        alert(response.data);
      }
    } else {
      alert("All fields must be filled");
    }
    this.setState({ sending: false });
  }

  validSend() {
    const { mailBody, mailTitle, toEmails, fromName } = this.state;
    if (
      mailBody === "" ||
      mailTitle === "" ||
      toEmails.length === 0 ||
      fromName === ""
    ) {
      return false;
    }
    return true;
  }

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
