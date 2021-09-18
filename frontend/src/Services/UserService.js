/* Reference:
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/user.service.js
*/

import axios from "axios";
import authHeader from "./authHeader";
import { API_URL } from "../constant";

class UserService {
  getUserBoard() {
    return axios.get(API_URL + "/findAllUsers", { headers: authHeader() });
  }

  async checkFriend(other_id, token) {
    
    const response = await axios.post(
      API_URL + "/friend/verifyFriendship",
      { id: other_id },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data !== null) {
      //this._isMounted && this.setState({ isFriend: response.data });
      return response.data;
    }
  
  }

  async sentFriendRequest(other_id, token) {
    const response = await axios.post(
      API_URL + "/friend/sendRequest",
      { id: other_id },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data) {
      return response.data;
    }
  }

  async deleteFriend(their_id, token) {
    
    const response = await axios.post(
      API_URL + "/friend/delete",
      { id: their_id },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data) {
      // alert(response.data);
      // window.location.reload();
      return response.data;
    }
  }

  async editFriendNote(their_id, token, note) {
    
    const response = await axios.post(
      API_URL + "/friend/changeNotes",
      {id: their_id, notes: note },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data) {
      return response.data;
    }
  }
}

export default new UserService();
