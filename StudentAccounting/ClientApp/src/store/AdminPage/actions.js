export const ADMIN_SEARCHPARAM_TEXT = "ADMIN_SEARCHPARAM_TEXT";
export const ADMIN_SET_USERS = "ADMIN_SET_USERS";

export const setSearchParamText = (searchParam) => ({
  type: "ADMIN_SEARCHPARAM_TEXT",
  payload: searchParam,
});

export const setUsers = (users) => ({
  type: "ADMIN_SET_USERS",
  payload: users,
});
