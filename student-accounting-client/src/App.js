import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import ConfirmEmailPage from "./Components/ConfirmEmailPage";
import NavBarMain from "./Components/Main/NavBarMain";
import MainCards from "./Components/Main/MainCards";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/authenticate">
            <LoginPage />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/confirm-email">
            <ConfirmEmailPage />
          </Route>
          <Route path="/main">
            <NavBarMain />
            <MainCards />
          </Route>
          <Route path="/">
            <LoginPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
