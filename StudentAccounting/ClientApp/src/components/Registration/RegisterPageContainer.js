import React from "react";
import RegisterPage from "./RegisterPage";
import { connect } from "react-redux";
import {
  setFirstNameText,
  setLastNameText,
  setAgeText,
  setEmailText,
  setPasswordText,
} from "../../store/RegisterPage/actions";

class RegisterPageContainer extends React.Component {
  render() {
    return <RegisterPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  return {
    firstName: state.registration.firstName,
    lastName: state.registration.lastName,
    age: state.registration.age,
    email: state.registration.email,
    password: state.registration.password,
  };
};
const mapDispatchToProps = {
  setFirstNameText,
  setLastNameText,
  setAgeText,
  setEmailText,
  setPasswordText,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPageContainer);
