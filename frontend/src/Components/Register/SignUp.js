import React, { Component } from "react";
import axios from "axios";
import "./SignUp.css";
import { Form, Input, Button, FormGroup, Label, Container } from "reactstrap";
import { API_URL } from "../../constant";
import { Row, Col } from "reactstrap";
import { Redirect } from "react-router-dom";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      msg: {},
      isWaiting: false,
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    //match two passowrds
    this.passwordConfirm = this.passwordConfirm.bind(this);
  }
  state = {
    userEmail: "",
    userPassword: "",
    userFirstName: "",
    userLastName: "",
    redirect: null,
  };

  // recieved two passwords
  passwordConfirm(event) {
    // this.state.input refers to line 14
    var input_password = this.state.input;
    input_password[event.target.name] = event.target.value;
    // set the input state, if there are two passwords, two passwords will be inside input_password
    this.setState({
      input_password,
    });
  }
  // validation two input passwords
  validation() {
    var msg = {};
    // two input passwords are not the same
    if (this.state.input["password"] !== this.state.input["confirm_password"]) {
      msg["password"] = "Password are not the same.";
    }
    // two input passwords are the same
    else {
      msg["confirm_password"] = "Password are same.";
    }
    this.setState({
      // input:this.state.input,
      msg: msg,
    });
  }
  async handleSubmit(event) {
    this.props.onLoading(true);
    this.setState({ isWaiting: true });
    event.preventDefault();
    this.validation();
    // password is the same
    if (this.state.input["password"] !== this.state.input["confirm_password"]) {
      // do nothing
    } else {
      //add the loading page
      const user = {
        email: this.state.userEmail,
        password: this.state.userPassword,
        first_name: this.state.userFirstName,
        last_name: this.state.userLastName,
        showPassword: false,
        personalSummary: "",
        areaOrRegion: "",
        company: "",
        industry: "",
      };
      await axios
        .post(API_URL + "/signup", user)
        .then((response) => {
          this.props.onLoading(false);
          if (response.data === "Email is already taken.") {
            this.setState({
              msg: { user_exist: "Email has been taken." },
            });
          }
          if (response.data === "Email is not valid.") {
            this.setState({
              msg: { email_invalid: "Email is not valid." },
            });
          }
          if (
            response.data === "You just successfully submit a signup request."
          ) {
            alert("Sign up was successful. Check email for verification link!");
            this.setState({ redirect: "/" });
            window.location.reload();
          }
        })
        .catch((err) => {
          this.props.onLoading(false);
          console.log(err);
          alert("An error occurs...");
        })
        .finally(() => {
          this.props.onLoading(false);
          this.setState({ isWaiting: false });
        });
    }
    this.setState({ isWaiting: false });
  }

  handleEmail(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePassword(event) {
    this.setState({ userPassword: event.target.value });
  }

  handleFirstName(event) {
    this.setState({ userFirstName: event.target.value });
  }

  handleLastName(event) {
    this.setState({ userLastName: event.target.value });
  }

  handleShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="background-sign-up">
        <Container id="signup-container">
          <br />
          <br />
          <center>
            <a href="/login" id="signup-to-signin">
              Already have account? Login here
            </a>
          </center>
          <br />
          <br />
          <Form className="signUp-form" onSubmit={this.handleSubmit}>
            <Row>
              <Col xs="6">
                <center>
                  <FormGroup className="formgroup">
                    <Label className="form-label" style={{ float: "left" }}>
                      &nbsp;Email
                    </Label>
                    <Input
                      type="email"
                      value={this.state.userEmail}
                      onChange={this.handleEmail}
                      placeholder="Email"
                      required
                    />
                  </FormGroup>
                </center>
              </Col>
            </Row>
            <Row>
              <Col xs="6">
                <br />
                <center>
                  <FormGroup className="formgroup">
                    <Label className="form-label" style={{ float: "left" }}>
                      {" "}
                      &nbsp;First Name
                    </Label>
                    <Input
                      type="text"
                      value={this.state.userFirstName}
                      onChange={this.handleFirstName}
                      placeholder="First Name"
                      required
                    />
                  </FormGroup>
                </center>
              </Col>
              <Col xs="5">
                <br />
                <FormGroup id="formgroup-password">
                  <Label className="signup-password" style={{ float: "left" }}>
                    {" "}
                    &nbsp;Password
                    <span id="requirement-text">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5-10 letters or numbers
                    </span>
                  </Label>
                  <Input
                    type={this.state.showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.passwordConfirm}
                    pattern="[A-Za-z0-9]{5,10}"
                    required
                  />
                </FormGroup>
              </Col>
              <Col xs="1" style={{ alignItems: "center" }}>
                <br />
                <Button
                  className="btn-show-password-register"
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
              <Col xs="6">
                <br />
                <center>
                  <FormGroup className="formgroup">
                    <Label className="form-label" style={{ float: "left" }}>
                      {" "}
                      &nbsp;Last Name
                    </Label>
                    <Input
                      type="text"
                      value={this.state.userLastName}
                      onChange={this.handleLastName}
                      placeholder="Last Name"
                      required
                    />
                  </FormGroup>
                </center>
              </Col>
              <Col xs="5">
                <br />
                <center>
                  <FormGroup id="formgroup-confirm-password">
                    <Label className="form-label" style={{ float: "left" }}>
                      &nbsp;Confirm Password
                    </Label>
                    <Input
                      type={this.state.showPassword ? "text" : "password"}
                      pattern="[A-Za-z0-9]{5,10}"
                      name="confirm_password"
                      value={this.state.userPassword}
                      onChange={(event) => {
                        this.handlePassword(event);
                        this.passwordConfirm(event);
                      }}
                      placeholder="Confirm Password"
                      required
                    />
                  </FormGroup>
                </center>
              </Col>
            </Row>
            <Row>
              <Col xs="4"></Col>
              <Col xs="4">
                <br />
                <center>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={this.state.isWaiting}
                    className="submit-btn btn-med btn-block btn-dark "
                  >
                    Register
                  </Button>
                </center>
              </Col>
              <Col xs="4">
                {/* display whether they are the same or not. */}
                {this.state.msg.password ? (
                  <div className=" display-text">{this.state.msg.password}</div>
                ) : (
                  ""
                )}
                {this.state.msg.user_exist ? (
                  <div className=" display-text">
                    {this.state.msg.user_exist}
                  </div>
                ) : (
                  ""
                )}
                {this.state.msg.email_invalid ? (
                  <div className=" display-text">
                    {this.state.msg.email_invalid}
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default SignUp;
