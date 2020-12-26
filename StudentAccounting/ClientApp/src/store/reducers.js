import { combineReducers } from "redux";
import { loginReducer } from "./Login/reducers";
import { registrationReducer } from "./RegisterPage/reducers";
import { adminPageReducer } from "./AdminPage/reducers";
import { studentPageReducer } from "./StudentPage/reducers";

export default combineReducers({
  login: loginReducer,
  registration: registrationReducer,
  adminPage: adminPageReducer,
  studentPage: studentPageReducer,
});
