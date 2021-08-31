import React, { Component } from "react";
import { Button } from "reactstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import axios from "axios";
import SearchResult from "./searchResult";

const API_URL = "http://localhost:8080/";

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      detailed: false,
      results: null,
      basic: JSON.parse(localStorage.getItem("basic")),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this.state.basic.token) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange(event) {
    if (event.target.value === "") {
      this._isMounted && this.setState({ results: null });
    } else {
      this.getResults(event.target.value);
    }
  }

  async getResults(value) {
    const { basic } = this.state;
    const response = await axios.post(
      API_URL + "user/sketchySearch",
      { searchKey: value },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      this._isMounted && this.setState({ results: response.data });
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

  handleSwitch(detailed) {
    const results = null;
    this.setState({ detailed, results });
  }

  sketchySearch() {
    return (
      <div>
        <form className="search-form">
          <input
            type="text"
            placeholder="  Search by type in email / first name / last name / region / company"
            className="search-bar"
            name="search"
            onChange={this.handleChange}
            onKeyPress={this.onKeyUp}
          />
          <Button
            className="btn-search"
            onClick={() => {
              this.nothingHappens();
            }}
          >
            <i className="fas fa-search" />
          </Button>
        </form>
      </div>
    );
  }

  searchResults() {
    const { results } = this.state;
    if (results.length === 0) {
      return <h1 className="not-found">None match</h1>;
    } else {
      return (
        <div className="search-results">
          {results.map((user) => (
            <SearchResult key={user.id} user={user} />
          ))}
        </div>
      );
    }
  }

  detailedSearch() {
    return (
      <div>
        <h1>Search</h1>
      </div>
    );
  }

  render() {
    return (
      <div className="centered">
        <BootstrapSwitchButton
          onChange={this.handleSwitch}
          checked={this.state.detailed}
          onstyle="primary"
          offstyle="info"
          onlabel="Detailed"
          offlabel="Sketchy"
          width={100}
        />
        {this.state.detailed ? this.detailedSearch() : this.sketchySearch()}
        {this.state.results && this.searchResults()}
      </div>
    );
  }
}

export default SearchUser;
