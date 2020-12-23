import React from "react";
import { Form, Dropdown, Col, Container, Row, Button } from "react-bootstrap";
import NavBarMain from "./Main/NavBarMain";
import { Popconfirm } from "antd";

import "./style/StudentProfile.css";
import { withRouter } from "react-router";

class StudentProfilePage extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.location.state.user.id);
    this.state = {
      id: this.props.location.state.user.id,
      firstName: this.props.location.state.user.firstName,
      lastName: this.props.location.state.user.lastName,
      age: this.props.location.state.user.age,
      email: this.props.location.state.user.email,
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

  handleDeleteUser(event) {
    const userTmp = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "DELETE",
      headers: new Headers({ Authorization: `Bearer ${userTmp.token}` }),
    };

    fetch(
      "https://localhost:44335/users/delete-user/" +
        this.props.location.state.user.id,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.props.history.push("/admin");
        }
      })
    );
  }

  handleUpdateUser(event) {
    const data = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: this.state.age,
      email: this.state.email,
    };
    const userTmp = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${userTmp.token}`,
      }),
      body: JSON.stringify(data),
    };

    fetch(
      "https://localhost:44335/users/update-user/" + this.state.id,
      request
    ).then((response) => {
      if (!response.ok) {
        window.alert(response.message);
      } else {
        this.props.history.push("/admin");
      }
      return response;
    });
  }

  render() {
    return (
      <Container>
        <NavBarMain />
        <Form style={{ margin: 10 }}>
          <Form.Group as={Row} controlId="formName">
            <Form.Label className="lbForm" column sm="6">
              Name
            </Form.Label>
            <Col sm="6">
              <Form.Control
                value={this.state.firstName}
                name="firstName"
                onChange={this.handleChange.bind(this)}
                plaintext
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formSurname">
            <Form.Label className="lbForm" column sm="6">
              Surname
            </Form.Label>
            <Col sm="6">
              <Form.Control
                value={this.state.lastName}
                name="lastName"
                onChange={this.handleChange.bind(this)}
                plaintext
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formPlaintextEmail">
            <Form.Label className="lbForm" column sm="6">
              Email
            </Form.Label>
            <Col sm="6">
              <Form.Control
                value={this.state.email}
                name="email"
                onChange={this.handleChange.bind(this)}
                plaintext
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formAge">
            <Form.Label className="lbForm" column sm="6">
              Age
            </Form.Label>
            <Col sm="6">
              <Form.Control
                value={this.state.age}
                name="age"
                onChange={this.handleChange.bind(this)}
                plaintext
              />
            </Col>
          </Form.Group>
          <Dropdown>
            <Dropdown.Toggle
              className="drobBtn"
              variant="success"
              id="dropdown-basic"
            >
              My subscriptions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Popconfirm
            title="Sure to delete?"
            onConfirm={this.handleDeleteUser.bind(this)}
          >
            <Button>Delete user</Button>
          </Popconfirm>

          <Button variant="warning" onClick={this.handleUpdateUser.bind(this)}>
            Update
          </Button>
        </Form>
      </Container>
    );
  }
}
export default withRouter(StudentProfilePage);
