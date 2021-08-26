import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
// import { Button,FormGroup,FormLabel,InputGroup,Form } from 'react-bootstrap';
// const API_URL = "https://crm-c-and-h-backend.herokuapp.com"
const API_URL = "http://localhost:8080";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {},
      msg: {},
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
      };
      await axios
        .post(API_URL + "/signup", user)
        .then((response) => {
          if (response.data === "Email is already taken.") {
            this.setState({
              msg: { user_exist: "Email Has been taken. Please login." },
            });
            alert(response.data);
          }
          if (response.data === "Email is not valid.") {
            this.setState({
              msg: { email_invalid: "Email is not valid. Please try again." },
            });
            alert(response.data);
          }
          if (
            response.data === "You just successfully submit a signup request."
          ) {
            alert("Sign up was successful.");
            this.props.history.push("/");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("an error occurs...");
        });
    }
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
              type="password"
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
              type="password"
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

          {/* display whether they are the same or not. */}
          <div className="text-danger">{this.state.msg.password}</div>
          {/* <div className = "text-success">{this.state.msg.confirm_password}</div> */}
          {/* display if the user exists */}
          <div className="text-danger">{this.state.msg.user_exist}</div>
          <div className="text-danger">{this.state.msg.email_invalid}</div>

          <Button
            type="submit"
            className="submit-btn btn-med btn-block btn-dark col-12"
          >
            Register
          </Button>
        </Form>
      </div>
    );
  }
}

export default SignUp;
/* <form onSubmit= {this.handleSubmit}>
          <label> email: </label>
          <input type = "text" value = {this.state.userEmail} onChange = {this.handleEmail} />
          
          <label>password: </label>
          <input type = "text" value = {this.state.userPassword} onChange = {this.handlePassword} />
          
          

          <label>First name: </label>
          <input type = "text" value = {this.state.userFirstName} onChange = {this.handleFirstName} />

          <label>Last name: </label>
          <input type = "text" value = {this.state.userLastName} onChange = {this.handleLastName} />

          <button type="submit">Submit</button>
      </form> */

// if (this.validation()){
//   alert("good")
//   alert(this.state.input["password"])
//   alert(this.state.input["confirm_password"])
//   if(this.state.input["password"] !== this.state.input["confirm_password"]){
//     alert("not good")
//   }
//   //reset the password
//   // password here is name property, the name with passowrd
//   var input = {}
//   input["password"] = "";
//   input["confirm_password"] = "";
// }
// const user = {
//   email: this.state.userEmail,
//   password: this.state.userPassword,
//   first_name: this.state.userFirstName,
//   last_name: this.state.userLastName
// }

// axios.post(API_URL + "/signup", user).
//   then(response => {
//     if (response.data != null){
//       alert("Sign up was successful.");
//     }else{
//       alert("caibi");
//     }
//   })
//   .catch(err => {
//     alert("caibi");
//   });

// event.preventDefault();
