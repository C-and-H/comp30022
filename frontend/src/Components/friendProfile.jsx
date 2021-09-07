import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import { API_URL } from "../constant";

class FriendUser extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      friend: null,
      id: this.props.match.params.id,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    const currentUser = AuthService.getCurrentUser();
    const basic = AuthService.getBasicInfo();

    if (!currentUser) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      await this.getFriendInfo(this.state.id);
      this._isMounted && this.setState({ currentUser, basic });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getFriendInfo(id) {
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
      this._isMounted && this.setState({ friend: response.data });
    }
  }

  render() {
    const { friend } = this.state;
    return (
      <div>{friend && <h1>Profile of your friend: {friend.name}</h1>}</div>
    );
  }
}

export default FriendUser;
