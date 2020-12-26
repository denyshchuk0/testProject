import { ADMIN_SEARCHPARAM_TEXT, ADMIN_SET_USERS } from "./actions";

const defaultState = {
  searchParam: "",
  users: [],
};

export const adminPageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADMIN_SEARCHPARAM_TEXT:
      return {
        ...state,
        searchParam: action.payload,
      };
    case ADMIN_SET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};
