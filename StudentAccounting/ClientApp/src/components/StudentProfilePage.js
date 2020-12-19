import React from "react";
import { Form, Dropdown, Col, Container, Row } from "react-bootstrap";
import NavBarMain from "./Main/NavBarMain";
import "./style/StudentProfile.css";
import { withRouter } from "react-router";

class StudentProfilePage extends React.Component {
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
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
              <Form.Control plaintext readOnly defaultValue="Name" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formSurname">
            <Form.Label className="lbForm" column sm="6">
              Surname
            </Form.Label>
            <Col sm="6">
              <Form.Control plaintext readOnly defaultValue="Surname" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formPlaintextEmail">
            <Form.Label className="lbForm" column sm="6">
              Email
            </Form.Label>
            <Col sm="6">
              <Form.Control
                plaintext
                readOnly
                defaultValue="email@example.com"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formAge">
            <Form.Label className="lbForm" column sm="6">
              Age
            </Form.Label>
            <Col sm="6">
              <Form.Control plaintext readOnly defaultValue="Age" />
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
        </Form>
      </Container>
    );
  }
}
export default withRouter(StudentProfilePage);
