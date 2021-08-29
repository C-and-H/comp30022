import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class FriendDisplay extends Component {
  render() {
    const { name } = this.props;
    return (
      <div>
        <Button variant="outline-dark" size="lg">
          <i className="fa fa-user-circle fa-fw"></i>
          {name}
        </Button>
      </div>
    );
  }
}

export default FriendDisplay;
