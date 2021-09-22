import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ReactTooltip from "react-tooltip";

class FriendDisplay extends Component {
  render() {
    const { user, note } = this.props;
    return (
      <span>
        <Button
          className="btn-friend"
          variant="outline-dark"
          size="lg"
          data-tip={note.length > 0 ? user.email + "<br />" + note : user.email}
          onClick={this.props.onClick}
        >
          <i className="fa fa-user-circle fa-fw" />
          {" " + user.first_name + " " + user.last_name}
        </Button>
        <ReactTooltip place="right" type="info" html={true} />
      </span>
    );
  }
}

export default FriendDisplay;
