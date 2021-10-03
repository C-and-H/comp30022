import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FriendDisplay from "../friendDisplay";
import { Redirect } from "react-router-dom";
import { API_URL } from "../../constant";
import { CSVLink } from "react-csv";

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    // friends => friend id and note tuple
    // friendList => friend user information
    this.state = {
      friends: [],
      friendList: [],
      friends_csv: [],
      redirect: null,
      headers_csv: [],
      show: false,
      searchList: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    
   
    this.getFriends();
    
  }

  /**
   * get contactRelation data from backend
   */
   async getFriends() {
    const { basic } = this.props;
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
      let friend_csv = [];
      for (let i = 0; i < friendList.length; i++) {
        let friend = friendList[i];

        let info = {
          email: friend.email,
          name: friend.name,
          company: friend.company,
          industry: friend.industry,
          personalSummary: friend.personalSummary,
          phone: friend.phone,
          note: friends[i][1],
        };
        friend_csv.push(info);
      }

      // set the header of the csv file
      const headers_csv = [
        { label: "Email", key: "email" },
        { label: "Full Name", key: "name" },
        { label: "Company", key: "company" },
        { label: "Industry", key: "industry" },
        { label: "Description", key: "personalSummary" },
        { label: "Phone Number", key: "phone" },
        { label: "Note", key: "note" },
      ];

      this.setState({ friends_csv: friend_csv });
      this.setState({ headers_csv: headers_csv });
      this.setState({ show: true });
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
          Authorization: "Bearer " + this.props.basic.token,
        },
      }
    );
    if (response.data) {
      // console.log(response.data)
      let friendList = [...this.state.friendList];
      friendList.push(response.data);
      // console.log(friendList)
      this.setState({ friendList });
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
        this.setState({ searchList: null });
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
      try {
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
        this.setState({ searchList });
      } catch (e) {
        this.setState({ searchList: [] });
      }
    }
  }

  /**
   *
   * @returns contact list header layout
   */
   header() {
    return (
      <div className="contact-header">
        <Button className="minus" title="delete friend">
          <i className="fas fa-user-minus" />
        </Button>
        <Button
          className="plus"
          title="add friend"
          onClick={() => this.redirectSearch()}
        >
          <i className="fas fa-user-plus" />
        </Button>
      </div>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { friendList, friends_csv, headers_csv, show, searchList } =
      this.state;
    // console.log(friendList)
    return (
      <div className="div-contact">
        <div className="rectangle">
          {this.header()}
          <div className="serch-contact-background">
            <input
              type="text"
              placeholder="Search"
              className="search-contact"
              name="search"
              onChange={this.handleChange}
              onKeyPress={this.onKeyUp}
            />
          </div>
          {/* not null and true then */}
          {searchList ? (
            searchList.length === 0 ? (
              <p>No match</p>
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
          <div className="export-contact">
            {!show && <p>export contacts</p>}
            {show && (
              <CSVLink
                data={friends_csv}
                headers={headers_csv}
                filename={"Contacts.csv"}
              >
                export contacts
              </CSVLink>
            )}
          </div>
        </div>

        
      </div>
    );
  }
}

export default Contacts;