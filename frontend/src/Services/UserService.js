/* Reference:
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/user.service.js
*/

import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:8080/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "findAllUsers", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserService();
