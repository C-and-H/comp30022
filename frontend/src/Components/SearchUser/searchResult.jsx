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
          {user.icon && user.icon !== "" ? (
            <i className={user.icon} />
          ) : (
            <i className="fa fa-user fa-fw" />
          )}
          {" " + user.first_name + " " + user.last_name}
          <br />
          {user.email}
        </Button>
      </span>
    );
  }
}

export default SearchResult;
