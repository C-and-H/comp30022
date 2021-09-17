/* Reference: 
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/auth.service.js
*/

import axios from "axios";
import { API_URL } from "../constant";

class AuthService {
  /**
   *
   * @param {*} token
   */
  async getUserDataFromBackend(token, id) {
    const response = await axios.post(
      API_URL + "/user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
  }

  async validToken(token) {
    const response = await axios.post(API_URL + "/jwt/checkExpired", {
      authToken: token,
    });

    if (!response.data) {
      await this.logout();
      alert("Login expired, please login again.");
    }
  }

  async login(username, password) {
    const response = await axios.post(API_URL + "/login", {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("basic", JSON.stringify(response.data));
      this.getNotificationPath();
    }
    return response.data;
  }

  /* send change password request */
  async changePassword(oldPassword, newPassword) {
    const user = this.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.post(
        API_URL + "/changePassword",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  async logout() {
    const notiPath = JSON.parse(localStorage.getItem("notificationPath"));
    const token = this.getBasicInfo().token;
    localStorage.removeItem("user");
    localStorage.removeItem("notifications");
    localStorage.removeItem("notificationPath");
    localStorage.removeItem("basic");
    await axios
      .post(
        API_URL + "/unsubscribe",
        {
          notificationPath: notiPath,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .catch();
  }

  register(username, email, password) {
    return axios.post(API_URL + "/signup", {
      username,
      email,
      password,
    });
  }

  getBasicInfo() {
    return JSON.parse(localStorage.getItem("basic"));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getNotificationPath() {
    const token = this.getBasicInfo().token;
    axios
      .get(API_URL + "/notification/register", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) =>
        localStorage.setItem("notificationPath", JSON.stringify(response.data))
      )
      .catch((err) => {
        alert("get noti path failed.");
      });
  }
}

export default new AuthService();
