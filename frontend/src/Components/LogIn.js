import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "../App.css";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";

const API_URL = "http://localhost:8080";

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      input: {},
      msg: {},
      redirect: null,
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    userEmail: "",
    userPassword: "",
  };

  handleEmail(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePassword(event) {
    this.setState({ userPassword: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const user = {
      email: this.state.userEmail,
      password: this.state.userPassword,
    };
    await axios
      .post(API_URL + "/login", user)
      .then((response) => {
        console.log(response);
        if (response.data === "Error during user authentication.") {
          this.setState({ msg: { fail: "Error during user authentication." } });
        }
        if (response.data === "You just successfully logged in.") {
          this.setState({
            msg: { success: "You just successfully logged in." },
          });
          this.setState({ redirect: "/homepage" });
        }
      })
      .catch((err) => {
        console.log(err);
        alert("an error occurs...");
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div>
        <Form className="signup-form" onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label className="form-label">&nbsp;Email</Label>
            <Input
              type="text"
              value={this.state.userEmail}
              onChange={this.handleEmail}
              placeholder="Email"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="form-label"> &nbsp;Password</Label>
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handlePassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>
          <div className="text-danger">{this.state.msg.fail}</div>
          <div className="text-danger">{this.state.msg.success}</div>

          <Button
            type="submit"
            className="submit-btn btn-med btn-block btn-dark col-12"
          >
            Log In
          </Button>
        </Form>
      </div>
    );
  }
}

export default LogIn;
