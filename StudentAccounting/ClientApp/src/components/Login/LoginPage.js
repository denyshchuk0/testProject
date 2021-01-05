import React from "react";
import { Form, Button, Col, Container, Row } from "react-bootstrap";
import "../style/LoginPage.css";
import { BASE_URL } from "../utils";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handleSubmit() {
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + "authenticate/authenticate", request).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          localStorage.setItem("user", JSON.stringify(json));
          localStorage.setItem("token", json.token);
          localStorage.setItem("role", json.name);
          var role = localStorage.getItem("role");
          if (role === "admin") {
            this.props.history.push("/admin");
          } else {
            this.props.history.push("/main");
          }
        }
      })
    );
  }

  handleRegistry() {
    this.props.history.push("/register");
  }

  render() {
    return (
      <Container>
        <Form>
          <Form.Row className="justify-content-md-center">
            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <h1>Welcome</h1>
                  <br />
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={this.state.email}
                    name="email"
                    onChange={this.handleChange.bind(this)}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange.bind(this)}
                  />
                </Form.Group>
                <Button
                  className="btnLogin"
                  variant="primary"
                  onClick={this.handleSubmit.bind(this)}
                >
                  Login
                </Button>
                <Button
                  className="btnRegistry"
                  variant="primary"
                  onClick={this.handleRegistry.bind(this)}
                >
                  Register
                </Button>
              </Col>
            </Row>
          </Form.Row>
        </Form>
      </Container>
    );
  }
}
