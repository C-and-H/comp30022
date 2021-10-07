import React from "react";
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import "./ChangePassword.css"
class ChangePassword extends React.Component {
  /**
   * the component used to render the change password form
   */
  constructor(props) {
    super(props);

    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleConfirmNewPassword = this.handleConfirmNewPassword.bind(this);
    this.handleOldPassword = this.handleOldPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    newPassword: "",
    confirmNewPassword: "",
    oldPassword: "",
    showPassword: false,
    redirect: null
  };

  componentDidMount() {
    if (AuthService.getBasicInfo() == null) {
      alert("Login required to access the page.");
      this.setState({ redirect: "/" });
    }
  }

  handleNewPassword(event) {
    this.setState({ newPassword: event.target.value });
  }

  handleOldPassword(event) {
    this.setState({ oldPassword: event.target.value });
  }

  handleConfirmNewPassword(event) {
    this.setState({ confirmNewPassword: event.target.value });
  }

  handleShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  /* redirect to /profile if success, otherwise refresh the current page */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.newPassword !== this.state.confirmNewPassword) {
      alert("Confirm New password does not match New Password!");
    } else {
      await AuthService.changePassword(
        this.state.oldPassword,
        this.state.newPassword
      )
        .then((response) => {
          if (
            response === "Account not found or not enabled." ||
            response === "Wrong old password." ||
            response === "New password is not valid." ||
            response === "New password is same as the old one."
          ) {
            alert(response);
            window.location.reload();
          } else {
            alert("You have successfully changed your password!");
            this.props.history.push("/profile");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("an error occurs...");
        });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="background-change-password">
        <Form className="signup-form" onSubmit={this.handleSubmit}>
        <div className="change-password-div"></div>
          <FormGroup className="change-password-formgroup">
            <Label className="setting-profile-form-label">&nbsp;Old Password</Label>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              placeholder="Your Old Password"
              name="Old Password"
              value={this.state.oldPassword}
              onChange={this.handleOldPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>
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
          {/* <ul className="password-requirement">
              <li>&nbsp;5-10 letters or numbers</li>
            </ul> */}
          <FormGroup className="change-password-formgroup">
            <Label className="setting-profile-form-label"> &nbsp;New Password
            <span id="requirement-text">
            &nbsp;&nbsp;&nbsp;&nbsp;5-10 letters or numbers</span>
            </Label>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              placeholder="Your New Password"
              name="New Password"
              value={this.state.newPassword}
              onChange={this.handleNewPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />

          </FormGroup>

          <FormGroup className="change-password-formgroup">
            <Label className="setting-profile-form-label"> &nbsp;Confirm New Password</Label>
            <Input
              type={this.state.showPassword ? "text" : "password"}
              placeholder="Confirm Your New Password"
              name="Confirm New Password"
              value={this.state.confirmNewPassword}
              onChange={this.handleConfirmNewPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
            
          </FormGroup>
          <center>
          <Button
            type="submit"
            className="submit-btn btn-med btn-block btn-dark change-password-submit-btn"
          >
            Submit
          </Button>
          </center>
        </Form>
      </div>
    );
  }
}

export default ChangePassword;
