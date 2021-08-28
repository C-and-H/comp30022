import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";

const API_URL = "http://localhost:8080/";

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      friends: null,
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const basic = AuthService.getBasicInfo();

    if (!currentUser) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      this.setState({ currentUser, basic });
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
    console.log(response);
    if (response.data) {
      return response.data;
    }
    return null;
  }

  render() {
    this.getFriends();
    return <p> aa</p>;
  }
}

export default ContactList;
