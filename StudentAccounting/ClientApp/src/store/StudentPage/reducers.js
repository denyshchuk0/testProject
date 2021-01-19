import { STUDENT_SET_COURSES } from "./actions";

const defaultState = {
  courses: [],
};

export const studentPageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case STUDENT_SET_COURSES:
      return {
        ...state,
        courses: action.payload,
      };

    default:
      return state;
  }
};
