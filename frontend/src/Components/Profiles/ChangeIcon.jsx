import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import {Button, Container, Row, Col, Label} from "reactstrap";
import '../../App.css'
import axios from "axios";
import { API_URL } from "../../constant";

const iconStyle = {
	marginTop: 40,
	
	fontSize: 100
}

export default class ChangeIcon extends Component{

  constructor(props){
    super(props);
    this.state = {
      chosen: "",
      redirect: null,
      userReady: false,
      currentUser: AuthService.getCurrentUser(),
      basic: localStorage.getItem("basic"),
      userID: JSON.parse(localStorage.getItem("user")).id
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
  }

  componentDidMount() {
    if (!this.state.currentUser) this.setState({ redirect: "/home" });

  }


  async changeIcon(newIcon) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      
      //newIcon = JSON.stringify(newIcon);
      //console.log(newIcon);
      const response = await axios.post (
        API_URL + "/user/changeIcon", 
        {
          icon: newIcon
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
      console.log(this.state.currentUser)
      
      return response.data;
    
    } else {
      return "An error has occured"
    }
  }

  
  handleClick(newIcon) {
    this.setState({chosen: newIcon});
    //console.log(this.state.chosen);
  }

  async handleSubmit() {
    let basic = AuthService.getBasicInfo();
    
    let newIcon = await this.changeIcon(this.state.chosen);
    console.log(this.newIcon);
    if (newIcon !== "An error has occured") {
      alert("Changes saved!");

    } else {
      alert(newIcon);
    }

    await AuthService.getUserDataFromBackend(basic.token, basic.id);
  }

  render() {

    const {redirect} = this.state;
    if (redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      
      <Container>
        <Row>
          <Col>
            <Button 
              className = "change-icon-btn-frame" 
              onClick={() => this.handleClick("fas fa-cat")}
            >
              <i  className="fas fa-cat" style={iconStyle}></i>
            </Button>
            
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("fa fa-user fa-fw")}
            >
              <i  className="fa fa-user fa-fw" style={iconStyle}></i>
            </Button>

          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	fas fa-dog")}
            >
              <i  className="	fas fa-dog" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	fas fa-dragon")}
            >
              <i  className="	fas fa-dragon" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	far fa-question-circle")}
            >
              <i  className="	far fa-question-circle" style={iconStyle}></i>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button 
              className = "change-icon-btn-frame" 
              onClick={() => this.handleClick("fas fa-fish")}
            >
              <i  className="fas fa-fish" style={iconStyle}></i>
            </Button>
            
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("fa fa-hippo")}
            >
              <i  className="fa fa-hippo" style={iconStyle}></i>
            </Button>

          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	fas fa-paw")}
            >
              <i  className="	fas fa-paw" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	fas fa-horse")}
            >
              <i  className="	fas fa-horse" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	far fa-angry")}
            >
              <i  className="	far fa-angry" style={iconStyle}></i>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button 
              className = "change-icon-btn-frame" 
              onClick={() => this.handleClick("far fa-kiss-beam")}
            >
              <i  className="far fa-kiss-beam" style={iconStyle}></i>
            </Button>
            
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("far fa-grin-tongue-wink")}
            >
              <i  className="far fa-grin-tongue-wink" style={iconStyle}></i>
            </Button>

          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	far fa-grin-beam")}
            >
              <i  className="	far fa-grin-beam" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	far fa-grin-tears")}
            >
              <i  className="	far fa-grin-tears" style={iconStyle}></i>
            </Button>
          </Col>
          <Col>
            <Button 
              className = "change-icon-btn-frame"
              onClick={() => this.handleClick("	far fa-grin-beam-sweat")}
            >
              <i  className="	far fa-grin-beam-sweat" style={iconStyle}></i>
            </Button>
          </Col>
        </Row>
        <Row className="change-icon-line">
          <Col></Col>
          <Col xs="7">
            <Button 
              className = "change-icon-btn-save"
              onClick={this.handleSubmit}
            >
              Save changes
            </Button>
          </Col>
          
          
        </Row>
        
      </Container>

      
    )
  }
}