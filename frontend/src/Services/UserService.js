/* Reference:
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/user.service.js
*/

import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:8080/";

class UserService {
  getUserBoard() {
    return axios.get(API_URL + "findAllUsers", { headers: authHeader() });
  }
}

export default new UserService();
