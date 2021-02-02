import React from "react";
import { Form, Button, Col, Container, Row } from "react-bootstrap";
import "../style/LoginPage.css";
import { BASE_URL } from "../utils";
import { message, Spin } from "antd";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();

    this.state = {
      email: "",
      password: "",
      loading: false,
      validated: false,
      isInvalid: false,
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

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  handleSubmit = (event) => {
    const form = this.refs["form"];
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

      this.setState({ validated: true });
      return;
    }

    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    this.login("authenticate/authenticate", data);
  };

  async handleFacebook() {
    const { authResponse } = await new Promise(window.FB.login);

    if (!authResponse) return;
    const data = {
      token: authResponse.accessToken,
    };

    this.login("authenticate/facebook-login", data);
  }

  login(route, data) {
    this.setState({ loading: true });
    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + route, request).then((response) => {
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          localStorage.setItem("user", JSON.stringify(json));
          localStorage.setItem("token", json.token);
          localStorage.setItem("role", json.name);
          var role = localStorage.getItem("role");
          if (role === "admin") {
            this.props.history.push("/admin");
          } else {
            localStorage.setItem("courses", JSON.stringify(json.courses));
            this.props.history.push("/main");
          }
        }
      });
    });
  }

  handleRegistry() {
    this.props.history.push("/register");
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Container>
            <Row className="justify-content-md-center">
              <Spin size="large" />
            </Row>
          </Container>
        ) : (
          <Container>
            <Form noValidate validated={this.state.validated} ref="form">
              <Form.Row className="justify-content-md-center">
                <Row>
                  <Col>
                    <Form.Group controlId="formBasicEmail">
                      <h1>Welcome</h1>
                      <br />
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        required
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
                        required
                        isInvalid={this.state.isInvalid}
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
                      className="btnFacebook"
                      variant="primary"
                      onClick={this.handleFacebook.bind(this)}
                    >
                      Facebook
                    </Button>
                  </Col>
                </Row>
              </Form.Row>
              <Form.Row className="justify-content-md-center">
                <Row>
                  <Button
                    className="btnRegistry"
                    variant="primary"
                    onClick={this.handleRegistry.bind(this)}
                  >
                    Register
                  </Button>
                </Row>
              </Form.Row>
            </Form>
          </Container>
        )}
      </React.Fragment>
    );
  }
}
