import React, { Component } from "react";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../Services/AuthService";
import "./LogIn.css";

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
      showPassword: false,
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

  handleShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
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
          response === "Account not enabled." ||
          response === "Wrong password!"
        ) {
          alert(response);
        } else {
          alert("Login succeeded. Welcome!");
          this.props.history.push("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        alert("login failed");
        console.log(err);
      });
  }

  render() {
    return (
      <div className="login-background">
        <Form className="signin-form" onSubmit={this.handleSubmit}>
          <FormGroup className="login-form-group">
            <Label className="form-label">&nbsp;Email</Label>
            <Input
              type="text"
              value={this.state.userEmail}
              onChange={this.handleEmail}
              placeholder="Email"
              required
            />
          </FormGroup>
          <FormGroup className="login-form-group">
            <Label className="form-label"> &nbsp;Password</Label>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handlePassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>
          <div className="password-toogle-icon">
              {<FontAwesomeIcon
                icon={this.state.showPassword ? faEye : faEyeSlash}
                onClick={() => this.handleShowPassword()}
              />}
          </div>         
          <Button
            type="submit"
            className="login-button"
            size="sm"
          >
            Log In
          </Button>
          <center className="div-signin-to-signup" >
            <a href="/signup" className="link-signin-to-signup">
              Haven't signed up yet? Register Now!
            </a>
          </center>
        </Form>     
      </div>
    );
  }
}

export default LogIn;
