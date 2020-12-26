import React from "react";
import StudentPage from "./StudentPage";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { setCourses } from "../../store/StudentPage/actions";

class StudentPageContainer extends React.Component {
  render() {
    return <StudentPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.studentPage.courses,
  };
};
const mapDispatchToProps = {
  setCourses,
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StudentPageContainer)
);
