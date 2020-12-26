import React from "react";
import {
  Form,
  Accordion,
  Col,
  Container,
  Row,
  Button,
  Card,
} from "react-bootstrap";
import NavBarMain from "../NavBarMain";
import { Popconfirm } from "antd";

import "../style/StudentProfile.css";
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
      headers: new Headers({
        Authorization: `Bearer ${userTmp.token}`,
      }),
    };

    fetch(
      "https://localhost:44335/users/delete-user/" +
        this.props.location.state.user.id,
      request
    ).then((response) => {
      if (!response.ok) {
        window.alert(response.message);
      } else {
        this.props.history.push("/admin");
      }
    });
  }

  handleUpdateUser() {
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
        <Row noGutters className="justify-content-md-center">
          <Col xs={6}>
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
              <Container>
                <Row className="justify-content-md-center">
                  <Col lg="4">
                    <Button
                      className="udBtn"
                      variant="warning"
                      onClick={this.handleUpdateUser.bind(this)}
                    >
                      Update
                    </Button>
                  </Col>
                  <Col lg="4">
                    <Popconfirm
                      title="Sure to delete?"
                      onConfirm={this.handleDeleteUser.bind(this)}
                    >
                      <Button className="udBtn" variant="danger">
                        Delete user
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Container>
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Courses
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>1--------------</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withRouter(StudentProfilePage);
