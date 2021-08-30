import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FriendDisplay from "./friendDisplay";
import { Redirect } from "react-router-dom";

const API_URL = "http://localhost:8080/";

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      friendList: [],
      redirect: null,
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const basic = AuthService.getBasicInfo();

    if (!currentUser) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      this.setState({ currentUser, basic });
      this.getFriends();
    }
  }

  async getFriends() {
    const { basic, currentUser } = this.state;
    const response = await axios.post(
      API_URL + "friend/listFriends",
      { id: currentUser.id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      for (let i = 0; i < response.data.length; i++) {
        await this.getFriendInfo(response.data[i].friendId);
      }
    }
  }

  redirectSearch() {
    const redirect = "/searchUser";
    this.setState({ redirect });
  }

  header() {
    return (
      <div className="contact-header">
        <Button className="minus">
          <i className="fas fa-user-minus" />
        </Button>
        <Button className="plus" onClick={() => this.redirectSearch()}>
          <i className="fas fa-user-plus" />
        </Button>
      </div>
    );
  }

  async getFriendInfo(id) {
    const response = await axios.post(
      API_URL + "user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + this.state.basic.token,
        },
      }
    );
    if (response.data) {
      let friendList = [...this.state.friendList];
      friendList.push(response.data);
      this.setState({ friendList });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { friendList } = this.state;
    return (
      <div className="rectangle">
        {this.header()}
        {friendList.map((friend) => (
          <FriendDisplay key={friend.id} user={friend} />
        ))}
      </div>
    );
  }
}

export default ContactList;
