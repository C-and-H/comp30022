import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import { API_URL } from "../constant";
import Button from "react-bootstrap/Button";
import ReactTooltip from "react-tooltip";
import { Redirect } from "react-router-dom";

class RequestSent extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      basic: AuthService.getBasicInfo(),
      requestList: null,
      redirect: null,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const basic = AuthService.getBasicInfo();

    if (!basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    }

    await this.getRequests();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getRequests() {
    const { basic } = this.state;
    const response = await axios.get(
      API_URL + "/friend/listSentRequests",
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

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
          Authorization: "Bearer " + this.state.basic.token,
        },
      }
    );
    if (response.data) {
      if (this.state.requestList === null) {
        let requestList = [];
        requestList.push(response.data);
        this._isMounted && this.setState({ requestList });
      } else {
        let requestList = [...this.state.requestList];
        requestList.push(response.data);
        this._isMounted && this.setState({ requestList });
      }
    }
  }

  async cancelRequest(id) {
    const { basic } = this.state;
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
    const redirect = "/user/" + id;
    this.setState({ redirect });
  }

  request(user) {
    return (
      <span key={user.id}>
        <Button
          className="btn-request-sent"
          variant="outline-dark"
          size="lg"
          data-tip={user.email}
          onClick={() => this.redirect(user.id)}
        >
          <i className="fa fa-user-circle fa-fw"></i>
          {" " + user.first_name + " " + user.last_name}
        </Button>
        <ReactTooltip place="right" type="info" html={true} />
        <Button
          className="btn btn-warning btn-outline-light btn-accept"
          onClick={() => this.cancelRequest(user.id)}
        >
          <i className="fa fa-times"></i>
        </Button>
      </span>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { requestList } = this.state;
    return (
      <div className="requests-list-received">
        <h1>Sent</h1>
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

export default RequestSent;
