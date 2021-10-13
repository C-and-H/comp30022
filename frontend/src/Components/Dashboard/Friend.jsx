import React, { Component } from "react";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import ReactTooltip from "react-tooltip";

class Friend extends Component {
  render() {
    const { user, note } = this.props;
    var icon = user.icon;
    if (!icon) icon = "fa fa-user fa-fw";
    return (
      <span style={{ whiteSpace: "pre-wrap" }}>
        <ButtonGroup className="btngroup-requests">
          <Button
            className="btn-user"
            variant="outline-light"
            size="lg"
            data-tip={
              note.length > 0 ? user.email + "<br />" + note : user.email
            }
            onClick={this.props.onClick}
          >
            <Row>
              <Col>
                <i className={icon} />
              </Col>
              <Col xs="10">{" " + user.first_name + " " + user.last_name}</Col>
            </Row>
          </Button>
          <ReactTooltip place="right" type="info" html={true} />
        </ButtonGroup>
      </span>
    );
  }
}

export default Friend;
