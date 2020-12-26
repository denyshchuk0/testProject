import React from "react";
import AdminPage from "./AdminPage";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { setSearchParamText, setUsers } from "../../store/AdminPage/actions";

class AdminContainer extends React.Component {
  render() {
    return <AdminPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  return {
    searchParam: state.adminPage.searchParam,
    users: state.adminPage.users,
  };
};
const mapDispatchToProps = {
  setSearchParamText,
  setUsers,
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminContainer)
);
