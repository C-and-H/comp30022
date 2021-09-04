import React from "react";
import '../../App.css'
import { Form, Input, Button, FormGroup, Label } from "reactstrap";
import {Row,Col } from 'reactstrap';
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
class SettingProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: AuthService.getCurrentUser(),
      basic: localStorage.getItem("basic"),
      userFirstName: JSON.parse(localStorage.getItem("user")).first_name,
      userLastName: JSON.parse(localStorage.getItem("user")).last_name,
      userID: JSON.parse(localStorage.getItem("user")).id
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.refresh = this.refresh.bind(this);
    
  }
  
  handleFirstName(event) {
    this.setState({ userFirstName: event.target.value });
  }

  handleLastName(event) {
    this.setState({ userLastName: event.target.value });
  }

  refresh(){
    window.location.reload(false);
  }
  async handleSubmit(event) {
    let basic = AuthService.getBasicInfo();
    event.preventDefault();
    // console.log(this.state.userFirstName, this.state.userLastName, this.state.userID)
    await AuthService.changeName(this.state.userFirstName, this.state.userLastName, this.state.userID).then((response) =>{
      alert(response)
    })
    // fetch the data from backend again
    await AuthService.getUserDataFromBackend(basic.token, basic.id);
    // reload the whole page after submit the form
    window.location.reload(false);
  }
  render (){
    return (
      <div>
      <h4 className="setting-profile-h4">Profile</h4>
      <Form className="setting-profile-form" onSubmit={this.handleSubmit}>
        <Row>
        <Col xs="4">
        <FormGroup className="setting-profile-formgroup">
          <Label className="setting-profile-form-label">First Name:</Label>
            <Input type="text" 
            placeholder={this.state.currentUser.first_name} 
            onChange={this.handleFirstName} 
            pattern="[A-Za-z0-9 ]+" 
            defaultValue={this.state.currentUser.first_name} required></Input>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup className="setting-profile-formgroup">
          <Label className="setting-profile-form-label">Last Name:</Label>
            <Input type="text" 
            placeholder={this.state.currentUser.last_name} 
            onChange={this.handleLastName} 
            pattern="[A-Za-z0-9 ]+" 
            defaultValue={this.state.currentUser.last_name} required></Input>
          </FormGroup>
        </Col>
        </Row>

        <Row><Col xs="4">
          <FormGroup className="setting-profile-formgroup">
            <Label className="setting-profile-form-label" style={{float:"left"}}>Email: </Label>
            <Input  placeholder={this.state.currentUser.username} disabled={true} pattern="[A-Za-z ]+" required></Input>
          </FormGroup>
        </Col></Row>

        <Row><Col xs="8">
        <FormGroup className="setting-profile-formgroup">
        <Label className="setting-profile-form-label" style={{float:"left"}}>Position: </Label>
        <Input type="text"></Input>
        </FormGroup>
        </Col></Row>

        <Row><Col xs="8">
        <FormGroup className="setting-profile-formgroup">
        <Label className="setting-profile-form-label" style={{float:"left"}}>Company: </Label>
        <Input type="text"></Input>
        </FormGroup>
        </Col></Row>

        <Row><Col xs="8">
        <FormGroup className="setting-profile-formgroup">
        <Label className="setting-profile-form-label" style={{float:"left"}}>Description: </Label>
        <Input type="text" style={{height:200}}></Input>
        </FormGroup>
        </Col></Row>
        
        <Row>
          <Col xs="4">
            <Button type="submit" className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-left">
              Save Changes
            </Button>
          </Col>
          <Col xs="4">
            <Button className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-right" onClick={this.refresh}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>

      </div>
    )
  }
}
export default SettingProfile;