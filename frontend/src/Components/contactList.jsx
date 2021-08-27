import React, { Component } from "react";
import AuthService from "../Services/AuthService";

class ContactList extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.state = {
      userReady: false,
      currentUser: { username: "" },
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      this.setState({ currentUser: currentUser, userReady: true });
    }
  }

  render() {
    return <div></div>;
  }
}

export default ContactList;
