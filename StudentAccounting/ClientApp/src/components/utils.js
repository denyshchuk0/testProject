export function isLoggedIn() {
  return localStorage.getItem("token") ? true : false;
}

export const BASE_URL = "https://localhost:44335/";

export function GetRole() {
  return localStorage.getItem("role");
}
