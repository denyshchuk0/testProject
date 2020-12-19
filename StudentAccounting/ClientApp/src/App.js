import React, { Component } from "react";
import { Route } from "react-router";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import "./custom.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ConfirmEmailPage from "./components/ConfirmEmailPage";
import AdminPage from "./components/AdminPage";
import StudentProfilePage from "./components/StudentProfilePage";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/confirm-email" component={ConfirmEmailPage} />
          <Route path="/main" component={MainPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/student-profile" component={StudentProfilePage} />
        </Switch>
      </Router>
    );
  }
}
