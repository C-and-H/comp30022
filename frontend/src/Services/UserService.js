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

  async checkFriend(my_id, other_id, token) {
    
    const response = await axios.post(
      API_URL + "/friend/verifyFriendship",
      { userId: my_id, friendId: other_id },
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

  async sentFriendRequest(my_id, other_id, token) {
    const response = await axios.post(
      API_URL + "/friend/sendRequest",
      { userId: my_id, friendId: other_id },
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

  async deleteFriend(my_id, their_id, token) {
    
    const response = await axios.post(
      API_URL + "/friend/delete",
      { userId: my_id, friendId: their_id },
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
}

export default new UserService();
