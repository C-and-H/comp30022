import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
} from "reactstrap";
import AuthService from "../../Services/AuthService";
import "./LogIn.css";
import { Redirect } from "react-router-dom";

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

  handleShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.props.onLoading(true);

    this.setState({
      loading: true,
    });

    await AuthService.login(this.state.userEmail, this.state.userPassword)
      .then((response) => {
        this.props.onLoading(false);
        if (
          response === "Email not found." ||
          response === "Account not enabled." ||
          response === "Wrong password!"
        ) {
          alert(response);
        } else {
          alert("Login succeeded. Welcome!");
          this.setState({ redirect: "/dashboard" });
          window.location.reload();
        }
      })
      .catch((err) => {
        this.props.onLoading(false);
        alert("login failed");
        console.log(err);
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="login-background">
        <Container className="signin-container">
          <br />
          <br />
          <center>
            <a href="/signup" className="link-signin-to-signup">
              Haven't signed up yet? Register Now!
            </a>
          </center>
          <br />
          <br />
          <div className="login-placeholder-row"></div>
          <Form className="signin-form" onSubmit={this.handleSubmit}>
            <Row>
              <Col xs={4}></Col>
              <Col xs={4}>
                <FormGroup className="login-form-group">
                  <Label className="login-form-label">&nbsp;Email</Label>
                  <Input
                    type="text"
                    value={this.state.userEmail}
                    onChange={this.handleEmail}
                    placeholder="Email"
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs={4}></Col>
            </Row>
            <Row>
              <Col xs={4}></Col>
              <Col xs={4}>
                <br />
                <FormGroup className="login-form-group">
                  <Label className="login-form-label"> &nbsp;Password</Label>
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
              </Col>
              <Col xs={4}>
                <br />
                <Button
                  className="login-btn-show-password"
                  onClick={() => this.handleShowPassword()}
                >
                  {this.state.showPassword ? (
                    <i className="fas fa-toggle-on toggle-icon"></i>
                  ) : (
                    <i className="fas fa-toggle-off toggle-icon"></i>
                  )}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="4"></Col>
              <Col xs="4">
                <br />
                <center>
                  <Button
                    type="submit"
                    className="login-btn btn-med btn-block btn-dark"
                    size="sm"
                  >
                    Log In
                  </Button>
                </center>
              </Col>
              <Col xs="4"></Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default LogIn;
