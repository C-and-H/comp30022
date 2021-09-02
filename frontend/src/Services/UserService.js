/* Reference:
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/user.service.js
*/

import axios from "axios";
import authHeader from "./authHeader";
import { API_URL } from "../constant";

class UserService {
  getUserBoard() {
    return axios.get(API_URL + "findAllUsers", { headers: authHeader() });
  }
}

export default new UserService();
