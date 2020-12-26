import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import { withRouter } from "react-router";

export default class RegisrtyPage extends React.Component {
  constructor(props) {
    super(props);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onAgeChange = this.onAgeChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onFirstNameChange(event) {
    this.props.setFirstNameText(event.target.value);
  }

  onLastNameChange(event) {
    this.props.setLastNameText(event.target.value);
  }
  onAgeChange(event) {
    this.props.setAgeText(event.target.value);
  }

  onEmailChange(event) {
    this.props.setEmailText(event.target.value);
  }

  onPasswordChange(event) {
    this.props.setPasswordText(event.target.value);
  }

  handleSubmit() {
    const data = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      age: this.props.age,
      email: this.props.email,
      password: this.props.password,
    };

    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };

    fetch("https://localhost:44335/authenticate/register", request).then(
      (response) => {
        if (!response.ok) {
          window.alert(response.message);
        } else {
          this.props.history.push("/confirm-email");
        }
        return response;
      }
    );
  }

  render() {
    return (
      <Form>
        <Form.Row className="justify-content-md-center">
          <Col xs={3}>
            <h1>Registration</h1>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                placeholder="Enter first name"
                value={this.props.firstName}
                name="firstName"
                onChange={this.onFirstNameChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                placeholder="Enter last name"
                value={this.props.lastName}
                name="lastName"
                onChange={this.onLastNameChange}
              />
              <Form.Group controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="age"
                  placeholder="Enter age"
                  value={this.props.age}
                  name="age"
                  onChange={this.onAgeChange}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={this.props.email}
                name="email"
                onChange={this.onEmailChange}
              />
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
