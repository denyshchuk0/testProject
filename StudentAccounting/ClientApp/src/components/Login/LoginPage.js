import React from "react";
import { Form, Button, Col, Container, Row } from "react-bootstrap";
import "../style/LoginPage.css";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onEmailChange(event) {
    this.props.setEmailText(event.target.value);
  }

  onPasswordChange(event) {
    this.props.setPasswordText(event.target.value);
  }

  handleSubmit() {
    const data = {
      email: this.props.email,
      password: this.props.password,
    };

    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };

    fetch("https://localhost:44335/authenticate/authenticate", request).then(
      (response) =>
        response.json().then((json) => {
          if (!response.ok) {
            window.alert(json.message);
          } else {
            localStorage.setItem("user", JSON.stringify(json));
            localStorage.setItem("token", json.token);
            localStorage.setItem("role", json.name);
            var user = JSON.parse(localStorage.getItem("user"));
            if (user.name === "admin") {
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

  handleFacebookLogin() {
    window.open("https://localhost:44335/users/facebook-login");
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
                    value={this.props.email}
                    name="email"
                    onChange={this.onEmailChange}
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
                    value={this.props.password}
                    onChange={this.onPasswordChange}
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
