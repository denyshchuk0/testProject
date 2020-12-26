import { combineReducers } from "redux";
import { loginReducer } from "./Login/reducers";
import { registrationReducer } from "./RegisterPage/reducers";

export default combineReducers({
  login: loginReducer,
  registration: registrationReducer,
});
