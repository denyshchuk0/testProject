import { combineReducers } from "redux";

import { adminPageReducer } from "./AdminPage/reducers";
import { studentPageReducer } from "./StudentPage/reducers";

export default combineReducers({
  adminPage: adminPageReducer,
  studentPage: studentPageReducer,
});
