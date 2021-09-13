import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FriendDisplay from "./friendDisplay";
import { Redirect } from "react-router-dom";
import { API_URL } from "../constant";
import RequestReceived from "./requestReceived";
import RequestSent from "./requestSent";

class ContactList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    // friends => friend id and note tuple
    // friendList => friend user information
    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      currentUser: JSON.parse(localStorage.getItem("user")),
      friends: [],
      friendList: [],
      redirect: null,
      searchList: null,
    };

    this.handleChange = this.handleChange.bind(this);
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
      this._isMounted && this.setState({ currentUser, basic });
      this.getFriends();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * get contactRelation data from backend
   */
  async getFriends() {
    const { basic, currentUser } = this.state;
    const response = await axios.post(
      API_URL + "/friend/listFriends",
      { id: currentUser.id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      let { friends } = this.state;
      for (let i = 0; i < response.data.length; i++) {
        await this.getFriendInfo(response.data[i].friendId);
        friends.push([response.data[i].friendId, response.data[i].notes]);
        this.setState({ friends });
      }
    }
  }

  /**
   * go to search page
   */
  redirectSearch() {
    const redirect = "/searchUser";
    this.setState({ redirect });
  }

  redirectFriend(id) {
    const redirect = "/user/" + id;
    this.setState({ redirect });
  }

  /**
   *
   * @returns contact list header layout
   */
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

  /**
   * get friends' detailed info by their id
   * @param {*} id id of interested user
   */
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
      let friendList = [...this.state.friendList];
      friendList.push(response.data);
      this._isMounted && this.setState({ friendList });
    }
  }

  friendNote(id) {
    const { friends } = this.state;
    for (let i = 0; i < friends.length; i++) {
      if (id === friends[i][0]) {
        return friends[i][1];
      }
    }
    return "";
  }

  /**
   * automatically search when user enter or delete something
   */
  handleChange(event) {
    if (!event.target.value || event.target.value === "") {
      this._isMounted && this.setState({ searchList: null });
    } else {
      this.matchContacts(event.target.value);
    }
  }

  /**
   * prevent refresh page when "ENTER" hits
   */
  onKeyUp(event) {
    if (event.charCode === 13) {
      event.preventDefault();
    }
  }

  /**
   * search friends' name, email, industry, company and areaOrRegion
   * @param {*} key search key
   */
  matchContacts(key) {
    const { friendList } = this.state;
    if (friendList.length > 0) {
      const search = new RegExp(key, "i");
      let searchList = [];
      for (let i = 0; i < friendList.length; i++) {
        if (search.test(friendList[i].name)) {
          searchList.push(friendList[i]);
          continue;
        }
        if (search.test(friendList[i].email)) {
          searchList.push(friendList[i]);
          continue;
        }
        if (search.test(friendList[i].industry)) {
          searchList.push(friendList[i]);
          continue;
        }
        if (search.test(friendList[i].company)) {
          searchList.push(friendList[i]);
          continue;
        }
        if (search.test(friendList[i].areaOrRegion)) {
          searchList.push(friendList[i]);
          continue;
        }
      }
      this._isMounted && this.setState({ searchList });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { friendList, searchList } = this.state;
    return (
      <div className="div-contact">
        <div className="rectangle">
          {this.header()}
          <input
            type="text"
            placeholder="Search"
            className="search-contact"
            name="search"
            onChange={this.handleChange}
            onKeyPress={this.onKeyUp}
          />
          {searchList ? (
            searchList.length === 0 ? (
              <h1>None match</h1>
            ) : (
              searchList.map((friend) => (
                <FriendDisplay
                  key={friend.id}
                  user={friend}
                  note={this.friendNote(friend.id)}
                  onClick={() => this.redirectFriend(friend.id)}
                />
              ))
            )
          ) : (
            friendList.map((friend) => (
              <FriendDisplay
                key={friend.id}
                user={friend}
                note={this.friendNote(friend.id)}
                onClick={() => this.redirectFriend(friend.id)}
              />
            ))
          )}
        </div>
        <RequestReceived />
        <RequestSent />
      </div>
    );
  }
}

export default ContactList;
