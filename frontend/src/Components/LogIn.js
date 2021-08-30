import React, { Component } from "react";
import "../App.css";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import AuthService from "../Services/AuthService";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      userPassword: "",
      loading: false,
      message: "",
      input: {},
      msg: {},
      redirect: null,
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmail(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePassword(event) {
    this.setState({ userPassword: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true,
    });

    await AuthService.login(this.state.userEmail, this.state.userPassword)
      .then((response) => {
        if (
          response === "Email not found." ||
          response === "Account not enabled."
        ) {
          alert(response);
        } else {
          alert("Login successed. Welcome!");
          this.props.history.push("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        alert("Login failed.");
      });
  }

  render() {
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
