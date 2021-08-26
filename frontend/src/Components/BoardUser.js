// https://github.com/bezkoder/react-jwt-auth/blob/master/src/components/board-user.component.js
import React, { Component } from "react";

import UserService from "../Services/UserService";
import EventBus from "../Common/EventBus";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1> HHHHHH</h1>
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
}
