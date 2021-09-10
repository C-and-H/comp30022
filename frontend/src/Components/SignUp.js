import React, { Component } from "react";
import axios from "axios";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import { withRouter } from "react-router-dom";
import { API_URL } from "../constant";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      msg: {},
    };
    this.isWaiting = false;
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
      msg["password"] = "Password Are Not The Same. Please retry.";
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
    this.isWaiting = true;
    event.preventDefault(); // what is this?
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
        personalSummary : "我叫阿杰，他们都叫我杰哥。我一个人住，我房子还蛮大的，欢迎你们来我家玩。我常常帮助一些翘家的人，如果你们不要来的话，也没有关系；如果要来的话，我等一下可以带你们去超商，买一些好吃的喔。",
        areaOrRegion : "台北",
        company : "网吧",
        industry: "登dua郎"
      };
      await axios
        .post(API_URL + "/signup", user)
        .then((response) => {
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
            this.props.history.push("/");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("an error occurs...");
        })
        .finally(() => {
          this.iswaiting = false;
        });
    }
    this.isWaiting = false;
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
    return (
      <div>
        <Form className="signup-form" onSubmit={this.handleSubmit}>
          <center>
            <h1>Sign up</h1>
            <center>
              <a href="/login" class="btn btn-primary" id="signup-to-signin">
                Already have account? Login here
              </a>
            </center>
          </center>
          <FormGroup>
            <Label className="form-label">&nbsp;Email</Label>
            <Input
              type="email"
              value={this.state.userEmail}
              onChange={this.handleEmail}
              placeholder="Email"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="form-label"> &nbsp;First Name</Label>
            <Input
              type="text"
              value={this.state.userFirstName}
              onChange={this.handleFirstName}
              placeholder="First Name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="form-label"> &nbsp;Last Name</Label>
            <Input
              type="text"
              value={this.state.userLastName}
              onChange={this.handleLastName}
              placeholder="Last Name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="signup-password"> &nbsp;Password</Label>
            {/* password requiement */}
            <ul className="password-requirement">
              <li>&nbsp;5-10 letters or numbers</li>
            </ul>
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
          <FormGroup>
            <Label className="form-label">&nbsp;Confirm Password</Label>
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

          {/* display whether or not to show password*/}
          <Button
            className="btn-show-password"
            onClick={() => this.handleShowPassword()}
          >
            {this.state.showPassword ? (
              <i className="fas fa-toggle-on toggle-icon"></i>
            ) : (
              <i className="fas fa-toggle-off toggle-icon"></i>
            )}
          </Button>

          {/* display whether they are the same or not. */}
          <div className="text-danger">{this.state.msg.password}</div>
          {/* <div className = "text-success">{this.state.msg.confirm_password}</div> */}
          {/* display if the user exists */}
          <div className="text-danger">{this.state.msg.user_exist}</div>
          <div className="text-danger">{this.state.msg.email_invalid}</div>

          <Button
            type="submit"
            disabled={this.isWaiting}
            className="submit-btn btn-med btn-block btn-dark col-12"
          >
            Register
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(SignUp);
