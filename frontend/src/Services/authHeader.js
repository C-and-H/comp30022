/* Reference
  https://github.com/bezkoder/react-jwt-auth/blob/master/src/services/auth-header.js
*/

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    return { "x-access-token": user.accessToken }; // for Node.js Express back-end
  } else {
    return {};
  }
}
