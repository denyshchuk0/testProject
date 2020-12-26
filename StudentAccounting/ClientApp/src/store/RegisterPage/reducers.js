import {
  REGISTRATION_CHANGE_FIRSTNAME_TEXT,
  REGISTRATION_CHANGE_LASTNAME_TEXT,
  REGISTRATION_CHANGE_AGE_TEXT,
  REGISTRATION_CHANGE_EMAIL_TEXT,
  REGISTRATION_CHANGE_PASSWORD_TEXT,
} from "./actions";

const defaultState = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  password: "",
};

export const registrationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTRATION_CHANGE_FIRSTNAME_TEXT:
      return {
        ...state,
        firstName: action.payload,
      };
    case REGISTRATION_CHANGE_LASTNAME_TEXT:
      return {
        ...state,
        lastName: action.payload,
      };
    case REGISTRATION_CHANGE_AGE_TEXT:
      return {
        ...state,
        age: action.payload,
      };
    case REGISTRATION_CHANGE_EMAIL_TEXT:
      return {
        ...state,
        email: action.payload,
      };
    case REGISTRATION_CHANGE_PASSWORD_TEXT:
      return {
        ...state,
        password: action.payload,
      };
    default:
      return state;
  }
};
