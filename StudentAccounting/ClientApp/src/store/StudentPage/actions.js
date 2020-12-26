export const STUDENT_SET_COURSES = "STUDENT_SET_COURSES";

export const setCourses = (courses) => ({
  type: STUDENT_SET_COURSES,
  payload: courses,
});
