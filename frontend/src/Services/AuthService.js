/* Reference: 
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/auth.service.js
*/

import axios from "axios";

const API_URL = "http://localhost:8080/";

class AuthService {
  /**
   *
   * @param {*} token
   */
  async getUserDataFromBackend(token, id) {
    const response = await axios.post(
      API_URL + "user",
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

  async login(username, password) {
    const response = await axios.post(API_URL + "login", {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("basic", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("basic");
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
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
}

export default new AuthService();
