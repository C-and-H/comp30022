import React from "react";
import axios from "axios";
import { API_URL } from "../../constant";

import ReactTooltip from "react-tooltip";

import "./Dashboard.css";
import { Redirect } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { ButtonGroup, Button, Row, Col } from "react-bootstrap";

class RequestList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requestList: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    await this.getRequests();
  }

  async getRequests() {
    const { basic } = this.props;
    const response = await axios.get(API_URL + "/friend/listSentRequests", {
      headers: {
        Authorization: "Bearer " + basic.token,
      },
    });

    if (response.data) {
      for (let i = 0; i < response.data.length; i++) {
        await this.getRequestInfo(response.data[i]);
      }
    }
  }

  async getRequestInfo(id) {
    const response = await axios.post(
      API_URL + "/user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + this.props.basic.token,
        },
      }
    );
    if (response.data) {
      if (this.state.requestList === null) {
        let requestList = [];
        requestList.push(response.data);
        this.setState({ requestList });
      } else {
        let requestList = [...this.state.requestList];
        requestList.push(response.data);
        this.setState({ requestList });
      }
    }
  }

  async cancelRequest(id) {
    const { basic } = this.props;
    const response = await axios.post(
      API_URL + "/friend/cancelRequest",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );
    if (response.data) {
      alert(response.data);
      window.location.reload();
    }
  }

  redirect(id) {
    const redirect = "/profile/" + id;
    this.setState({ redirect });
  }

  request(user) {
    var icon = user.icon;
    if (!icon) icon = "fa fa-user fa-fw";
    return (
      <span key={user.id}>
        <ButtonGroup className="btngroup-requests">
          <Button
            className="btn-user"
            variant="outline-light"
            size="lg"
            data-tip={user.email}
            onClick={() => this.redirect(user.id)}
          >
            <div>
              <Row>
                <Col>
                  <i className={icon}></i>
                </Col>
                <Col className="full-name" xs="9">
                  {" " + user.first_name + " " + user.last_name}
                </Col>
              </Row>
            </div>
          </Button>
          <ReactTooltip place="right" type="info" html={true} />
          <IconButton
            color="error"
            size="large"
            onClick={() => this.cancelRequest(user.id)}
          >
            <ClearIcon />
          </IconButton>
        </ButtonGroup>
      </span>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { requestList } = this.state;
    return (
      <div className="requests-list">
        <div className="small-header">
        <h1 className="requests-header">Sent</h1>
        </div>
        
        
        {requestList &&
          (requestList.length === 0 ? (
            <h1>No Request</h1>
          ) : (
            requestList.map((user) => this.request(user))
          ))}
      </div>
    );
  }
}

export default RequestList;
