export function isLoggedIn() {
  return localStorage.getItem("token") ? true : false;
}

export function GetRole() {
  return localStorage.getItem("role");
}
