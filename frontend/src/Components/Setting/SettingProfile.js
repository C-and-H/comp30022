import React from "react";
// import "../../App.css";
import "./Setting.css";
import { Form, Input, Button, FormGroup, Label, Container } from "reactstrap";
import { Row, Col } from "reactstrap";
import AuthService from "../../Services/AuthService";
import { API_URL } from "../../constant";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
class SettingProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: AuthService.getCurrentUser(),
      basic: localStorage.getItem("basic"),
      userFirstName: JSON.parse(localStorage.getItem("user")).first_name,
      userLastName: JSON.parse(localStorage.getItem("user")).last_name,
      userID: JSON.parse(localStorage.getItem("user")).id,
      areaOrRegion: JSON.parse(localStorage.getItem("user")).areaOrRegion,
      industry: JSON.parse(localStorage.getItem("user")).industry,
      company: JSON.parse(localStorage.getItem("user")).company,
      description: JSON.parse(localStorage.getItem("user")).personalSummary,
      phone: JSON.parse(localStorage.getItem("user")).phone,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleAreaOrRegion = this.handleAreaOrRegion.bind(this);
    this.handleIndustry = this.handleIndustry.bind(this);
    this.handleCompany = this.handleCompany.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    // this.handleMobile = this.handleMobile.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeAreaOrRegion = this.changeAreaOrRegion.bind(this);
    this.changeCompany = this.changeCompany.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }

  handleFirstName(event) {
    this.setState({ userFirstName: event.target.value });
  }

  handleLastName(event) {
    this.setState({ userLastName: event.target.value });
  }

  handleAreaOrRegion(event) {
    this.setState({ areaOrRegion: event.target.value });
  }

  handleIndustry(event) {
    this.setState({ industry: event.target.value });
  }

  handleCompany(event) {
    this.setState({ company: event.target.value });
  }

  handleDescription(event) {
    this.setState({ description: event.target.value });
  }

  /* send change name request */
  async changeName(first_name, last_name, id) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changeRealName",
        {
          first_name,
          last_name,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  /* post the data to backend to change area or origion */
  async changeAreaOrRegion(id, areaOrRegion) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changeAreaOrRegion",
        {
          areaOrRegion,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  /*post the data to backend to change the industry infomation*/
  async changeIndustry(id, industry) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changeIndustry",
        {
          industry,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  /*post the data to backend to change the industry infomation*/
  async changeCompany(id, company) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changeCompany",
        {
          company,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  /* post the data to backend to change personal summary*/
  async changeDescription(id, personalSummary) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changePersonalSummary",
        {
          personalSummary,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  /* post the data to backend to change area or origion */
  async changePhone(id, mobileNumber) {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/user/changePhone",
        {
          mobileNumber,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }
  
  handleCancel() {
    this.props.history.push("/profile");
    window.location.reload();
  }

  async handleSubmit(event) {
    // alert(this.state.phone)
    console.log(this.state.phone === "");
    console.log(this.state.phone);
    let basic = AuthService.getBasicInfo();
    event.preventDefault();
    console.log(
      this.state.userFirstName,
      this.state.userLastName,
      this.state.userID,
      this.state.areaOrRegion,
      this.state.phone
    );

    // TODO: Remove the parameter of the functions to change information

    // get the message from the backend and store it in a variable
    let msg_changeName = await this.changeName(
      this.state.userFirstName,
      this.state.userLastName,
      this.state.userID
    );
    let msg_areaOrRegion = await this.changeAreaOrRegion(
      this.state.userID,
      this.state.areaOrRegion
    );
    let msg_industry = await this.changeIndustry(
      this.state.userID,
      this.state.industry
    );
    let msg_company = await this.changeCompany(
      this.state.userID,
      this.state.company
    );
    let msg_description = await this.changeDescription(
      this.state.userID,
      this.state.description
    );
    let msg_phone = await this.changePhone(this.state.userID, this.state.phone);

    // fetch the data from backend again
    await AuthService.getUserDataFromBackend(basic.token, basic.id);

    // error message display
    if (!(msg_changeName === "You just successfully changed your name.")) {
      alert("cannot change you name, please try again.");
    }
    if (
      !(msg_areaOrRegion === "You just successfully changed your area/region.")
    ) {
      alert("cannot change your area/region, please try again.");
    }
    if (!(msg_company === "You just successfully changed your company.")) {
      alert("cannot change your industry, please try again.");
    }
    if (!(msg_company === "You just successfully changed your company.")) {
      alert("cannot change your company, please try again.");
    }
    if (
      !(
        msg_description ===
        "You just successfully changed your personal summary."
      )
    ) {
      alert("cannot change your personal summary, please try again.");
    }
    if (!(msg_phone === "You just successfully change your phone number.")) {
      alert("cannot change your phone number, please try again");
    }

    // change success message display
    if (
      msg_changeName === "You just successfully changed your name." &&
      msg_areaOrRegion === "You just successfully changed your area/region." &&
      msg_industry === "You just successfully changed your industry." &&
      msg_company === "You just successfully changed your company." &&
      msg_description ===
        "You just successfully changed your personal summary." &&
      msg_phone === "You just successfully change your phone number."
    ) {
      alert("You have successfully change your personal details.");
    }
    // reload the whole page after submit the form
    window.location.reload(false);
  }
  render() {
    return (
      <div id="background-setting">
        <Container id="container">
        
        <Form className="setting-profile-form" onSubmit={this.handleSubmit}>

        <Row>
        <div className="setting-profile-h4"></div>
            <Col xs="4">
              <FormGroup className="setting-profile-formgroup">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Email:{" "}
                </Label>
                <Input
                  placeholder={this.state.currentUser.username}
                  disabled={true}
                  pattern="[A-Za-z ]+"
                  required
                ></Input>
              </FormGroup>
            </Col>
            <Col xs="4"></Col>
            <Col xs="4">
            <FormGroup className="setting-profile-formgroup">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Mobile:{" "}
                </Label>
                <div>
                  <PhoneInput
                    country={"au"}
                    value={this.state.currentUser.phone}
                    onChange={(phone) => this.setState({ phone })}
                    placeholder="61 (46) 1234 567"
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="4">
              <FormGroup className="setting-profile-formgroup">
                <Label className="setting-profile-form-label">
                  First Name:
                </Label>
                <Input
                  type="text"
                  placeholder={this.state.currentUser.first_name}
                  onChange={this.handleFirstName}
                  pattern="[A-Za-z0-9 ]+"
                  defaultValue={this.state.currentUser.first_name}
                  required
                ></Input>
              </FormGroup>
            </Col>
            <Col xs="4">
              <FormGroup className="setting-profile-formgroup">
                <Label className="setting-profile-form-label">Last Name:</Label>
                <Input
                  type="text"
                  placeholder={this.state.currentUser.last_name}
                  onChange={this.handleLastName}
                  pattern="[A-Za-z0-9 ]+"
                  defaultValue={this.state.currentUser.last_name}
                  required
                ></Input>
              </FormGroup>
            </Col>
            <Col xs="4">
            <FormGroup className="setting-profile-formgroup">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Area / Origion:{" "}
                </Label>
                <Input
                  type="text"
                  placeholder={this.state.currentUser.areaOrRegion}
                  onChange={this.handleAreaOrRegion}
                  defaultValue={this.state.currentUser.areaOrRegion}
                ></Input>
              </FormGroup>
              </Col>
          </Row>

          <Row>
          <Col xs="8">
              <FormGroup className="setting-profile-formgroup-description">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Description:{" "}
                </Label>
                
                <Input
                  type="textarea"
                  className="setting-profile-description-input"
                  placeholder={this.state.currentUser.personalSummary}
                  onChange={this.handleDescription}
                  defaultValue={this.state.currentUser.personalSummary}
                ></Input>
              </FormGroup>
          </Col>
            <Col xs="4">
              <FormGroup className="setting-profile-formgroup">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Industry:{" "}
                </Label>
                <Input
                  type="text"
                  placeholder={this.state.currentUser.industry}
                  onChange={this.handleIndustry}
                  defaultValue={this.state.currentUser.industry}
                ></Input>
              </FormGroup>
              <FormGroup className="setting-profile-formgroup">
                <Label
                  className="setting-profile-form-label"
                  style={{ float: "left" }}
                >
                  Company:{" "}
                </Label>
                <Input
                  type="text"
                  placeholder={this.state.currentUser.company}
                  onChange={this.handleCompany}
                  defaultValue={this.state.currentUser.company}
                ></Input>
              </FormGroup>
              <Button
                type="submit"
                className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-left"
              >
                Save Changes
              </Button>
              <Button
                className="submit-btn btn-med btn-block btn-dark setting-profile-submit-btn-right"
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
            </Col>

          </Row>

          <Row>
            <Col xs="8">

            </Col>
          </Row>

          <Row>
            
          </Row>

          <Row>
            <Col xs="4">
            </Col>
          </Row>
        </Form>
        </Container>
      </div>
    );
  }
}
export default SettingProfile;
