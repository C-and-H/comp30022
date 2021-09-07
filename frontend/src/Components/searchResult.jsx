import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class SearchResult extends Component {
  render() {
    const { user } = this.props;
    return (
      <span>
        <Button
          className="btn-searchResult"
          variant="outline-dark"
          size="lg"
          onClick={this.props.onClick}
        >
          <i className="fa fa-user-circle fa-fw"></i>
          {" " + user.first_name + " " + user.last_name + " " + user.email}
        </Button>
      </span>
    );
  }
}

export default SearchResult;
