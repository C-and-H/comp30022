import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";

class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
    };
  }

  redirectUser() {
    const redirect = "/user/" + this.props.user.id;
    this.setState({ redirect });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { user } = this.props;
    return (
      <span>
        <Button
          className="btn-searchResult"
          variant="outline-dark"
          size="lg"
          onClick={() => this.redirectUser()}
        >
          <i className="fa fa-user-circle fa-fw"></i>
          {" " + user.first_name + " " + user.last_name + " " + user.email}
        </Button>
      </span>
    );
  }
}

export default SearchResult;
