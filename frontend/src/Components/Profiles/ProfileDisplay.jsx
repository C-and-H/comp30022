import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import { Button, Container, Row, Col, Label } from "reactstrap";
import { Dropdown } from "react-bootstrap";
import "../../App.css";

import UserService from "../../Services/UserService";

const iconStyle = {
  marginTop: 40,
  marginLeft: 60,
  fontSize: 200,
};

export default class ProfileDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      //currentUser: localStorage.getItem("user"),
      currentUser: null,
      basic: AuthService.getBasicInfo(),
      hasPhone: false,
      hasIndustry: false,
      hasRegion: false,
      hasCompany: false,
      hasSummary: false,
      myself: false,
      isFriend: false,
      icon: "fa fa-user fa-fw",
      btnText: null,
      disableBtn: false,
      note: "",
    };
    this.friendBtn = this.friendBtn.bind(this);
    this.startChat = this.startChat.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const { basic } = this.state;
    const self = AuthService.getCurrentUser();
    var currentUser;
    if (!basic) {
      this.setState({ redirect: "/" });
      return;
    }

    //console.log(this.props.match.params.id);
    if (this.props.id && this.props.id !== self.id) {
      currentUser = await AuthService.getOtherUser(
        basic.token,
        this.props.id
      );

      let friendship = await UserService.checkFriend(
        this.props.id,
        basic.token
      );
      this.setState({ isFriend: friendship });
      //this.setState({myself:false})
    } else {
      //this.setState({currentUser: AuthService.getCurrentUser()});
      currentUser = await AuthService.getCurrentUser();
      this.setState({ myself: true });
    }

    if (this.state.isFriend) {
      this.setState({ btnText: "Unfriend" });
      this.setState({ note: this.state.isFriend.notes });
    } else {
      this.setState({ btnText: "Add" });
    }

    //console.log(cur	rentUser);
    // if not login

    if (!currentUser) {
      this.setState({ redirect: "/home" });
    } else {
      this.setState({
        currentUser: currentUser,
        userReady: true,
        id: currentUser.id,
      });
      // display following if they exist
      if (currentUser.phone) this.setState({ hasPhone: true });
      if (currentUser.industry) this.setState({ hasIndustry: true });
      if (currentUser.company) this.setState({ hasCompany: true });
      if (currentUser.personalSummary) this.setState({ hasSummary: true });
      if (currentUser.areaOrRegion) this.setState({ hasRegion: true });
      if (currentUser.icon) this.setState({ icon: currentUser.icon });
    }
  }

  async handleClick() {
    const { isFriend } = this.state;
    const user = AuthService.getBasicInfo();
    if (isFriend) {
      // send delete friend request
      await UserService.deleteFriend(this.props.id, user.token);
      this.setState({ btnText: "Add friend" });
      window.location.reload();
    } else {
      // send friend request
      await UserService.sentFriendRequest(
        this.props.id,
        user.token
      );
      this.setState({ btnText: "Sent" });
      //console.log("bruh")
      this.setState({ disableBtn: true });
    }

    await AuthService.getUserDataFromBackend(user.token, user.id);
    
  }

  friendBtn() {
    const { btnText, disableBtn } = this.state;
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col xs="6">
            <Button
              className="profile-display-icon-btn"
              disabled={disableBtn}
              onClick={() => this.handleClick()}
            >
              {btnText}
            </Button>
          </Col>

          <Col></Col>
        </Row>
      </Container>
    );
  }

  startChat() {
    const { currentUser } = this.state;

    localStorage.setItem("chat", JSON.stringify(currentUser));
    
    window.location = "/chat";
    //console.log(this.state.btnText);
  }

  chatBtn() {
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col xs="6">
            <Dropdown>
              <Dropdown.Toggle
                className="profile-display-icon-btn"
                
                
                // onClick={this.startChat}
              >
                Chat
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={this.startChat} >
                  Text
                </Dropdown.Item>
                <Dropdown.Item onClick={() => 
                  {this.props.onCall(this.props.id);}}>
                  {"Video & Voice"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          <Col></Col>
        </Row>
      </Container>
    );
  }

  render() {
    const {
      currentUser,
      hasIndustry,
      hasPhone,
      hasRegion,
      hasCompany,
      // hasGender,
      hasSummary,
      myself,
      icon,
      isFriend,
      note,
    } = this.state;

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    if (!currentUser) {
      return <div></div>;
    }

    if (!currentUser.first_name) return <div>User does not exist</div>;
    const fullName = currentUser.first_name + " " + currentUser.last_name;
    console.log(currentUser);
    // console.log(fullName);
    return (
      <div ref={this.wrapper}>
        <Container>
          <Row className="profile-display-header">{fullName}</Row>
          <Row className="profile-display-bar">
            <Col>Basic Info</Col>
            <Col></Col>
            {myself ? (
              <Col>
                <Button className="profile-display-edit-btn" href="/setting">
                  Edit My Profile!
                </Button>
              </Col>
            ) : (
              <></>
            )}
          </Row>

          <Row className="profile-display-inner-container">
            <Col>
              <Container>
                <Row>
                  <i className={icon} style={iconStyle}></i>
                </Row>
                {myself ? (
                  <Row className="profile-display-line">
                    <Col></Col>
                    <Col xs="6">
                      <Button
                        className="profile-display-change-btn"
                        href="/changeIcon"
                      >
                        Change Icon
                      </Button>
                    </Col>

                    <Col></Col>
                  </Row>
                ) : (
                  <Container>
                    <Row className="profile-display-line">
                      {this.friendBtn()}
                    </Row>
                    {isFriend ? (
                      <Row className="profile-display-line">
                        {this.chatBtn()}
                      </Row>
                    ) : (
                      <></>
                    )}
                  </Container>
                )}
              </Container>
            </Col>
            <Col xs="8">
              <Container>
                <Row>
                  <Col>
                    <Label className="profile-display-line">Industry:</Label>
                  </Col>

                  <Col>
                    {hasIndustry ? (
                      <Label className="profile-display-value">
                        {currentUser.industry}
                      </Label>
                    ) : (
                      <Label className="profile-display-value">Not set!</Label>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label className="profile-display-line">Company:</Label>
                  </Col>
                  <Col>
                    {hasCompany ? (
                      <Label className="profile-display-value">
                        {currentUser.company}
                      </Label>
                    ) : (
                      <Label className="profile-display-value">Not set!</Label>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label className="profile-display-line">Region:</Label>
                  </Col>
                  <Col>
                    {hasRegion ? (
                      <Label className="profile-display-value">
                        {currentUser.areaOrRegion}
                      </Label>
                    ) : (
                      <Label className="profile-display-value">Not set!</Label>
                    )}
                  </Col>
                </Row>
                <Row>
                  {hasSummary ? (
                    <Col>
                      <Label className="profile-display-line">
                        Something About Me :
                      </Label>
                      <div>
                      <p className="profile-display-p">
                        {currentUser.personalSummary}
                      </p>
                      </div>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
              </Container>
            </Col>
          </Row>

          <Row className="profile-display-bar">
            <Col>Contact Detail</Col>
            <Col></Col>
            {myself ? (
              <Col>
                <Button className="profile-display-edit-btn" href="/setting">
                  Edit My Profile!
                </Button>
              </Col>
            ) : (
              <></>
            )}
          </Row>

          <Row>
            <Col>
              <Label className="profile-display-contact-line">Email:</Label>
            </Col>
            <Col>
              <Label className="profile-display-contact-value">
                {currentUser.email}
              </Label>
            </Col>
          </Row>
          {hasPhone ? (
            <Row>
              <Col>
                <Label className="profile-display-contact-line">
                  Phone Number:
                </Label>
              </Col>
              <Col>
                <Label className="profile-display-contact-value">
                  {currentUser.phone}
                </Label>
              </Col>
            </Row>
          ) : (
            <></>
          )}

          {isFriend ? (
            <Container>
              <Row className="profile-display-bar">
                <Col>Note On This Friend</Col>
                <Col></Col>
                <Col>
                  <Button
                    className="profile-display-edit-btn"
                    href={"/settingNote/" + this.props.id}
                  >
                    Change Note
                  </Button>
                </Col>
              </Row>
              <Row>
                <p className="profile-display-p">{note}</p>
              </Row>
            </Container>
          ) : (
            <></>
          )}
        </Container>
      </div>
    );
  }
}
