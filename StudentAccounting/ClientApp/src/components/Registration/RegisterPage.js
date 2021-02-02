import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import { BASE_URL } from "../utils";
import { message } from "antd";

export default class RegisrtyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      password: "",
      validated: false,
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

  handleSubmit = (event) => {
    const form = this.refs["form"];

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }

    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: this.state.age,
      email: this.state.email,
      password: this.state.password,
    };

    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + "authenticate/register", request).then((response) => {
      console.log(response);
      if (!response.ok) {
        message.info(response.message);
      } else {
        this.props.history.push("/confirm-email");
      }
    });
  };

  render() {
    return (
      <Form noValidate validated={this.state.validated} ref="form">
        <Form.Row className="justify-content-md-center">
          <Col xs={3}>
            <h1>Registration</h1>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                placeholder="Enter first name"
                value={this.state.firstName}
                name="firstName"
                type="text"
                onChange={this.handleChange.bind(this)}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                placeholder="Enter last name"
                value={this.state.lastName}
                name="lastName"
                type="text"
                onChange={this.handleChange.bind(this)}
              />
              <Form.Group controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Enter age"
                  value={this.state.age}
                  name="age"
                  type="number"
                  onChange={this.handleChange.bind(this)}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={this.state.email}
                name="email"
                onChange={this.handleChange.bind(this)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange.bind(this)}
              />
            </Form.Group>

            <Button
              style={{ width: 110 }}
              variant="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              Register
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}
