import React, { Component } from "react";
import { Route } from "react-router";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import "./custom.css";
import MainPage from "./components/MainPage";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Registration/RegisterPage";
import ConfirmEmailPage from "./components/Registration/ConfirmEmailPage";
import AdminContainer from "./components/AdminPage/AdminContainer";
import StudentProfilePage from "./components/AdminPage/StudentProfilePage";
import { isLoggedIn, GetRole } from "./components/utils";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./store/reducers";

const store = createStore(rootReducer);

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
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/signin-facebook" component={ConfirmEmailPage} />
            <Route path="/confirm-email" component={ConfirmEmailPage} />
            <this.RoleRoute path="/admin">
              <AdminContainer />
            </this.RoleRoute>
            <this.PrivateRoute path="/main">
              <MainPage />
            </this.PrivateRoute>
            <Route path="/student-profile/:id" component={StudentProfilePage} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
