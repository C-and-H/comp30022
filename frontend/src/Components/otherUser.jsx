import React, { Component } from "react";
import AuthService from "../Services/AuthService";
import axios from "axios";
import { Form, Input, Button } from "reactstrap";
import { API_URL } from "../constant";

class OtherUser extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      basic: JSON.parse(localStorage.getItem("basic")),
      friend: null,
      id: this.props.match.params.id,
      isFriend: null,
      edit: false,
      note: "",
    };

    this.handleNote = this.handleNote.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    const basic = AuthService.getBasicInfo();

    if (!basic) {
      alert("Login required to access the page.");
      this.props.history.push("/");
      window.location.reload();
    } else {
      await this.checkFriend();
      await this.getFriendInfo(this.state.id);
      this._isMounted && this.setState({ basic });
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

  async sentFriendRequest() {
    const { basic, id } = this.state;
    const response = await axios.post(
      API_URL + "/friend/sendRequest",
      { userId: basic.id, friendId: id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data) {
      alert(response.data);
    }
  }

  async deleteFriend() {
    const { basic, id } = this.state;
    const response = await axios.post(
      API_URL + "/friend/delete",
      { userId: basic.id, friendId: id },
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

  async checkFriend() {
    const { basic, id } = this.state;
    const response = await axios.post(
      API_URL + "/friend/verifyFriendship",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );

    if (response.data !== null) {
      this._isMounted && this.setState({ isFriend: response.data });
    }
  }

  async editFriendNote() {
    const { basic, id, note } = this.state;
    const response = await axios.post(
      API_URL + "/friend/changeNotes",
      { userId: basic.id, friendId: id, notes: note },
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

  handleNote(event) {
    this.setState({ note: event.target.value });
  }

  friendProfile() {
    const { friend, isFriend, edit, note } = this.state;
    return (
      <div>
        <h1>Profile of your friend: {friend.name}</h1>
        <Button
          className="btn-search"
          onClick={() => {
            this.deleteFriend();
          }}
        >
          <i className="fas fa-minus" />
        </Button>
        {edit ? (
          <Form>
            <Input
              type="text"
              value={note}
              onChange={this.handleNote}
              placeholder="Note"
              className="note-input"
            />
            <Button
              className="btn-search"
              onClick={() => {
                this.editFriendNote();
              }}
            >
              <i className="fas fa-save" />
            </Button>
          </Form>
        ) : (
          <div>
            <h1>Note: {isFriend.first.notes}</h1>
            <Button
              className="btn-search"
              onClick={() => {
                this.setState({ edit: true, note: isFriend.first.notes });
              }}
            >
              <i className="fas fa-pencil-alt" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  nonFriendProfile() {
    const { friend } = this.state;
    return (
      <div>
        <h1>Profile of non-friend user: {friend.name}</h1>
        <Button
          className="btn-search"
          onClick={() => {
            this.sentFriendRequest();
          }}
        >
          <i className="fas fa-plus" />
        </Button>
      </div>
    );
  }

  render() {
    const { isFriend, friend } = this.state;
    return (
      <div>
        {friend && (isFriend ? this.friendProfile() : this.nonFriendProfile())}
      </div>
    );
  }
}

export default OtherUser;
