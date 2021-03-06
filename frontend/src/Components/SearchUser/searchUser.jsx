import React, { Component } from "react";
import { Form, Input, Button, Container, Row, Col } from "reactstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import axios from "axios";
import SearchResult from "./searchResult";
import { API_URL } from "../../constant";
import { Redirect } from "react-router-dom";

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      detailed: false,
      results: null,
      basic: JSON.parse(localStorage.getItem("basic")),
      firstName: "",
      lastName: "",
      email: "",
      areaOrRegion: "",
      industry: "",
      company: "",
      redirect: null,
      isEmpty: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleArea = this.handleArea.bind(this);
    this.handleIndustry = this.handleIndustry.bind(this);
    this.handleCompany = this.handleCompany.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this.state.basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * automatically search when user enter or delete something
   */
  handleChange(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ results: null, isEmpty: true });
    } else {
      this._isMounted && this.setState({ isEmpty: false });
      this.getResults(event.target.value);
    }
  }

  /**
   * get the sketchy search results from backend
   * @param {*} value the input from user
   */
  async getResults(value) {
    const search = this.state.detailed;
    const { basic } = this.state;
    const response = await axios.post(
      API_URL + "/user/sketchySearch",
      { searchKey: value },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      !this.state.isEmpty &&
        search === this.state.detailed &&
        this._isMounted &&
        this.setState({ results: response.data });
    }
  }

  /**
   * get the detailed search results from backend
   */
  async getDetails() {
    const search = this.state.detailed;
    if (this.validInput()) {
      const {
        basic,
        firstName,
        lastName,
        email,
        areaOrRegion,
        industry,
        company,
      } = this.state;
      const response = await axios.post(
        API_URL + "/user/search",
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          areaOrRegion: areaOrRegion,
          industry: industry,
          company: company,
        },
        {
          headers: {
            Authorization: "Bearer " + basic.token,
          },
        }
      );

      if (response.data) {
        search === this.state.detailed &&
          this._isMounted &&
          this.setState({ results: response.data });
      }
    } else {
      alert("At least one field must be filled!");
    }
  }

  /**
   *  just to make the button clickable but nothing will happen
   */
  nothingHappens() {}

  /**
   * prevent refresh page when "ENTER" hits
   */
  onKeyUp(event) {
    if (event.charCode === 13) {
      event.preventDefault();
    }
  }

  /**
   * switch between sketchy search and detailed search
   */
  handleSwitch(detailed) {
    const results = null;
    this.setState({ detailed, results });
  }

  /**
   * input updates for detailed search
   */
  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  handleLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  handleArea(event) {
    this.setState({ areaOrRegion: event.target.value });
  }

  handleIndustry(event) {
    this.setState({ industry: event.target.value });
  }

  handleCompany(event) {
    this.setState({ company: event.target.value });
  }

  handleSubmit() {
    this.getDetails();
  }

  /**
   *
   * @returns search bar layout for sketchy search
   */
  sketchySearch() {
    return (
      <form className="search-form">
        <input
          type="text"
          placeholder="  Search by email / first name / last name / region / company"
          className="search-bar"
          name="search"
          onChange={this.handleChange}
          onKeyPress={this.onKeyUp}
        />
        {/* <Button
          className="btn-search"
          onClick={() => {
            this.nothingHappens();
          }}
        >
          <i className="fas fa-search" />
        </Button> */}
      </form>
    );
  }

  /**
   *
   * @returns display the search results
   */
  searchResults() {
    const { results, detailed } = this.state;
    if (results.length === 0) {
      return <h1 className="not-found">None match</h1>;
    } else {
      var result_name = "search-results";
      if (detailed) {
        result_name = "search-results-1";
      }
      return (
        <div className={result_name}>
          {results.map((user) => (
            <SearchResult
              key={user.id}
              user={user}
              onClick={() => this.redirectUser(user.id)}
            />
          ))}
        </div>
      );
    }
  }

  /**
   *
   * @returns search bar layout for detailed search
   */
  detailedSearch() {
    const { firstName, lastName, email, areaOrRegion, industry, company } =
      this.state;
    return (
      <Container>
        <Form className="search-form-detailed">
          <Row>
            <Col xs="5">
              <Input
                type="text"
                value={firstName}
                onChange={this.handleFirstName}
                placeholder="First Name"
                className="search-detailed-left"
              />
            </Col>
            <Col xs="2">
              <Input
                type="text"
                value={lastName}
                onChange={this.handleLastName}
                placeholder="Last Name"
                className="search-detailed-center"
              />
            </Col>
            <Col xs="5">
              <Input
                type="text"
                value={email}
                onChange={this.handleEmail}
                placeholder="Email"
                className="search-detailed-right"
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="5">
              <Input
                type="text"
                value={areaOrRegion}
                onChange={this.handleArea}
                placeholder="Area or Region"
                className="search-detailed-left"
              />
            </Col>
            <Col xs="2">
              <Input
                type="text"
                value={industry}
                onChange={this.handleIndustry}
                placeholder="Industry"
                className="search-detailed-center"
              />
            </Col>
            <Col xs="5">
              <Input
                type="text"
                value={company}
                onChange={this.handleCompany}
                placeholder="Company"
                className="search-detailed-right"
              />
            </Col>
          </Row>
          <Button
            className="btn-search-detailed"
            onClick={() => this.handleSubmit()}
          >
            Search
          </Button>
        </Form>
        <div className="div-search-bottom-line"></div>
      </Container>
    );
  }

  /**
   * Detailed search requires at least one field to be none empty
   */
  validInput() {
    const { firstName, lastName, email, areaOrRegion, industry, company } =
      this.state;
    return !(
      firstName.length === 0 &&
      lastName.length === 0 &&
      email.length === 0 &&
      areaOrRegion.length === 0 &&
      industry.length === 0 &&
      company.length === 0
    );
  }

  redirectUser(id) {
    const redirect = "/profile/" + id;
    this.setState({ redirect });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="centered">
        <BootstrapSwitchButton
          onChange={this.handleSwitch}
          checked={this.state.detailed}
          onstyle="primary"
          offstyle="danger"
          onlabel="Detailed"
          offlabel="Sketchy"
          width={100}
          size="sm"
        />
        {this.state.detailed ? this.detailedSearch() : this.sketchySearch()}
        {this.state.results && this.searchResults()}
      </div>
    );
  }
}

export default SearchUser;
