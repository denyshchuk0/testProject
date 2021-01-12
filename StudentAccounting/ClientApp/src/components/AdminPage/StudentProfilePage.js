import React from "react";
import { Form, Col, Container, Row, Button } from "react-bootstrap";
import NavBarMain from "../NavBarMain";
import { Popconfirm, Spin, message } from "antd";
import "../style/StudentProfile.css";
import { withRouter } from "react-router";
import { BASE_URL } from "../utils";

class StudentProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      firstName: "",
      lastName: "",
      age: 0,
      email: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    if (localStorage.getItem("role") === "student") {
      var user = JSON.parse(localStorage.getItem("user"));
      this.setState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: parseInt(user.age, 10),
        email: user.email,
      });
      this.setState({ loading: false });
    } else {
      const token = localStorage.getItem("token");
      const request = {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      };

      fetch(BASE_URL + `users/${this.props.match.params.id}`, request).then(
        (response) => {
          if (!response.ok) {
            message.info(response.message);
          } else {
            this.setState({ loading: false });
            response.json().then((data) =>
              this.setState({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                age: parseInt(data.age, 10),
                email: data.email,
              })
            );
          }
        }
      );
    }
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

  handleDeleteUser() {
    const token = localStorage.getItem("token");
    const request = {
      method: "DELETE",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    };

    fetch(BASE_URL + "users/delete-user/" + this.state.id, request).then(
      (response) => {
        if (!response.ok) {
          message.info(response.message);
        } else {
          this.props.history.push("/admin");
        }
      }
    );
  }

  handleUpdateUser() {
    const data = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: parseInt(this.state.age, 10),
      email: this.state.email,
    };

    const token = localStorage.getItem("token");
    const request = {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + "users/update-user/" + this.state.id, request).then(
      (response) => {
        if (!response.ok) {
          message.info(response.message);
        } else {
          this.props.history.push("/admin");
        }
        return response;
      }
    );
  }

  render() {
    return (
      <Container>
        <NavBarMain />

        {this.state.loading ? (
          <Container>
            <Row className="justify-content-md-center">
              <Spin size="large" />
            </Row>
          </Container>
        ) : (
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
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default withRouter(StudentProfilePage);
