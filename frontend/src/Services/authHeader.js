/* Reference
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/auth-header.js
*/

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
