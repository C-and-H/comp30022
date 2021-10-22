import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import { ButtonGroup, ToggleButton, Button, Row, Col } from "react-bootstrap";
import "../../App.css";
import "./Profile.css";
import axios from "axios";
import { API_URL } from "../../constant";
import {
  icons1,
  icons2,
  icons3,
  icons4,
  icons5,
  icons6,
  icons7,
  icons8,
} from "./icons";

const iconStyle = {
  marginTop: "20%",

  fontSize: "2vw",
};

const previewStyle = {
  alignSelf: "center",
  fontSize: "15vw",
  marginLeft: "17%",
};

export default class ChangeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: "",
      redirect: null,
      userReady: false,
      currentUser: AuthService.getCurrentUser(),
      basic: localStorage.getItem("basic"),
      userID: JSON.parse(localStorage.getItem("user")).id,
      iconId: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (!this.state.currentUser) this.setState({ redirect: "/home" });
  }

  async changeIcon(newIcon) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;

      const response = await axios.post(
        API_URL + "/user/changeIcon",
        {
          icon: newIcon,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response.data);
      console.log(this.state.currentUser);

      return response.data;
    } else {
      return "An error has occured";
    }
  }

  handleClick(newIcon) {
    this.setState({ chosen: newIcon.name, iconId: newIcon.id });
  }

  handleCancel() {
    this.props.history.push("/profile");
    window.location.reload();
  }

  async handleSubmit() {
    let basic = AuthService.getBasicInfo();

    let newIcon = await this.changeIcon(this.state.chosen);
    console.log(this.newIcon);
    if (newIcon !== "An error has occured") {
      alert("Changes saved !");
    } else {
      alert(newIcon);
    }

    await AuthService.getUserDataFromBackend(basic.token, basic.id);
    this.props.history.push("/profile");
    window.location.reload();
  }

  icons() {
    const { iconId } = this.state;
    return (
      <div className="icons">
        <ButtonGroup className="icon-row" vertical>
          {icons1.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>

        <ButtonGroup className="icon-row" vertical>
          {icons2.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup className="icon-row" vertical>
          {icons3.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup className="icon-row" vertical>
          {icons4.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup className="icon-row" vertical>
          {icons5.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>

        <ButtonGroup className="icon-row" vertical>
          {icons6.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup className="icon-row" vertical>
          {icons7.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup className="icon-row" vertical>
          {icons8.map((icon) => (
            <ToggleButton
              type="radio"
              key={icon.id}
              variant="outline-info"
              checked={iconId === icon.id}
              onClick={() => this.handleClick(icon)}
            >
              <i className={icon.name} style={iconStyle} />
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
    );
  }

  render() {
    const { redirect, chosen } = this.state;
    if (redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div className="change-icon-background">
        <Row>
          <Col>{this.icons()}</Col>
          <Col>
            <div className="preview-box">
              <i className={chosen} style={previewStyle} />
            </div>
            <br></br>
            <div className="change-icon-btns">
              <Row>
                <Col>
                  <Button
                    className="change-icon-save"
                    variant="success"
                    onClick={this.handleSubmit}
                  >
                    Save
                  </Button>
                </Col>
                <Col>
                  <Button variant="danger" onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
