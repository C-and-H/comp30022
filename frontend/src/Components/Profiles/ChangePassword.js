import React from 'react';
import { Form, Input, Button, FormGroup, Label } from "reactstrap";

class ChangePassword extends React.Component {
  constructor() {
    super();

    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleConfirmNewPassword = this.handleConfirmNewPassword.bind(this)
    this.handleOldPassword = this.handleOldPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    newPassword: "",
    confirmNewPassword: "",
    oldPassword: "",
  };

  handleNewPassword(event) {
    this.setState({ newPassword: event.target.value });
  }

  handleOldPassword(event) {
    this.setState({ oldPassword: event.target.value });
  }

  handleConfirmNewPassword(event) {
    this.setState({ confirmNewPassword: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      alert("Confirm New password does not match New Password!");
    } else {
      alert("Ok!");
    }
  }


  render(){
    return(
      <div>
        <Form className="signup-form" onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label className="form-label">&nbsp;Old Password</Label>
            <Input
              type="password"
              placeholder="Your Old Password"
              name="Old Password"
              value={this.state.oldPassword}
              onChange={this.handleOldPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="form-label"> &nbsp;New Password</Label>
            <Input
              type="password"
              placeholder="Your New Password"
              name="New Password"
              value={this.state.newPassword}
              onChange={this.handleNewPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label"> &nbsp;Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Confirm Your New Password"
              name="Confirm New Password"
              value={this.state.confirmNewPassword}
              onChange={this.handleConfirmNewPassword}
              pattern="[A-Za-z0-9]{5,10}"
              required
            />
          </FormGroup>

          <Button
            type="submit"
            className="submit-btn btn-med btn-block btn-dark col-12"
          >
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}
export default ChangePassword;