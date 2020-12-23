import React, { Component } from "react";
import { Route } from "react-router";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import "./custom.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ConfirmEmailPage from "./components/ConfirmEmailPage";
import AdminPage from "./components/AdminPage";
import StudentProfilePage from "./components/StudentProfilePage";
import { isLoggedIn, GetRole } from "./components/utils";

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: isLoggedIn(),
      getRole: GetRole(),
      role: "",
    };
  }

  PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isLoggedIn() ? (
            children
          ) : (
            <Redirect to={{ pathname: "/", state: { from: location } }} />
          )
        }
      />
    );
  }

  RoleRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) => {
          if (GetRole() === "admin") {
            return children;
          } else {
            return (
              <Redirect to={{ pathname: "/main", state: { from: location } }} />
            );
          }
        }}
      />
    );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/confirm-email" component={ConfirmEmailPage} />
          <this.RoleRoute path="/admin">
            <AdminPage />
          </this.RoleRoute>
          <this.PrivateRoute path="/main">
            <MainPage />
          </this.PrivateRoute>
          <Route path="/student-profile" component={StudentProfilePage} />
        </Switch>
      </Router>
    );
  }
}
