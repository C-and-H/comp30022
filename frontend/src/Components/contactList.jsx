import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FriendDisplay from "./friendDisplay";
import { Redirect } from "react-router-dom";
import { API_URL } from "../constant";
import RequestReceived from "./requestReceived";
import RequestSent from "./requestSent";
import {CSVLink} from "react-csv";

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
      friends_csv:[],
      redirect: null,
      headers_csv:[],
      show: false,
      searchList: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  
  async componentDidMount() {
    this._isMounted = true;
    const currentUser = AuthService.getCurrentUser();
    const basic = AuthService.getBasicInfo();

    if (!currentUser) {
      alert("Login required to access the page contact.");
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
    const { basic } = this.state;
    const response = await axios.get(API_URL + "/friend/listFriends", {
      headers: {
        Authorization: "Bearer " + basic.token,
      },
    });

    if (response.data) {
      let { friends } = this.state;
      for (let i = 0; i < response.data.length; i++) {
        await this.getFriendInfo(response.data[i].friendId);
        friends.push([response.data[i].friendId, response.data[i].notes]);
        this.setState({ friends });
      
      }
      
      // deal with export contacts data to csv
      let { friendList } = this.state;
      let friend_csv = []
      for(let i = 0; i < friendList.length; i++){
        let friend = friendList[i]
        
        let info = {
          email: friend.email,
          name: friend.name,
          company: friend.company,
          industry: friend.industry,
          personalSummary: friend.personalSummary,
          phone: friend.phone,
          note: friends[i][1]
        }
        friend_csv.push(info)
      }
      
      // set the header of the csv file
      const headers_csv = [
        {label: 'Email', key: 'email'},
        {label: 'Full Name', key: 'name'},
        {label: 'Company', key: 'company'},
        {label: 'Industry', key: 'industry'},
        {label: 'Description', key: 'personalSummary'},
        {label: 'Phone Number', key: 'phone'},
        {label: 'Note', key: 'note'},
      ]

      this.setState({friends_csv: friend_csv})
      this.setState({headers_csv: headers_csv})
      this.setState({show: true})
    }
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
        // console.log(response.data)
        let friendList = [...this.state.friendList];
        friendList.push(response.data);
        // console.log(friendList)
        this._isMounted && this.setState({ friendList });
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
    const redirect = "/profile/" + id;
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
   * search friends' name, email, industry, company, areaOrRegion
   * and friend notes
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
        if (search.test(this.friendNote(friendList[i].id))) {
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
    const { friendList ,friends_csv, headers_csv, show, searchList } = this.state;
    // console.log(friendList)
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
        <div>
        {!show && <p>export contacts</p>}
        {show && <CSVLink data={friends_csv} headers={headers_csv} filename={"Contacts"} >export contacts</CSVLink>}
        </div>
        <RequestReceived />
        <RequestSent />
      </div>
    );
  }
}

export default ContactList;
