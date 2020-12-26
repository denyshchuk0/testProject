import React from "react";
import "../style/LoginPage.css";
import LoginPage from "./LoginPage";
import { connect } from "react-redux";
import { setEmailText, setPasswordText } from "../../store/Login/actions";

class LoginContainet extends React.Component {
  render() {
    return <LoginPage {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.login.email,
    password: state.login.password,
  };
};
const mapDispatchToProps = {
  setEmailText,
  setPasswordText,
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainet);
