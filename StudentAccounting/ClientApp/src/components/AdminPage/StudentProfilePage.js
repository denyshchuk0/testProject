import React, { useState, useEffect, useRef } from "react";

//import { Form, Col, Container, Row, Button } from "react-bootstrap";
import NavBarMain from "../NavBarMain";
import {
  Spin,
  message,
  Layout,
  PageHeader,
  Button,
  Image,
  Row,
  Col,
  Form,
  InputNumber,
  Input,
  Divider,
  Modal,
  Radio,
} from "antd";
import "../style/StudentProfile.css";
import { withRouter } from "react-router";
import { BASE_URL } from "../utils";
import { ModalFooter } from "react-bootstrap";

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
      plaintext: true,
      update: true,
      validated: true,
      visibleUpdate: false,
      visibleDelete: false,
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
      this.getUserById();
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
          message.info("User was deleted");
        }
      }
    );
  }

  handleUpdateUser() {
    this.setState({ plaintext: false, update: false });
  }

  handleCancelUpdateUser() {
    this.getUserById();
    this.setState({ visibleUpdate: false });
    console.log(this.state.firstName);
    this.setState({ plaintext: true, update: true });
  }

  getUserById() {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(BASE_URL + `users/${this.props.match.params.id}`, request).then(
      (response) => {
        console.log(response);
        if (!response.ok) {
          message.info(response.message);
        } else {
          this.setState({ loading: false });
          response.json().then((data) => {
            this.setState({
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              age: parseInt(data.age, 10),
              email: data.email,
            });
            console.log(this.state.firstName);
          });
        }
      }
    );
  }

  handleSaveUpdateUser = (event) => {
    const form = this.refs["form"];

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }
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
          message.info("User was updated!");

          this.setState({ plaintext: true, update: true });
        }
        return response;
      }
    );
  };
  validate = () => {
    if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.age < 0
    ) {
      this.state.validated = false;
    } else {
      this.state.validated = true;
    }
  };
  render() {
    const [form] = Form.useForm();

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };

    return (
      <Layout>
        <NavBarMain />
        {this.state.loading ? (
          <Spin size="large" />
        ) : (
          <React.Fragment>
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Home"
              subTitle="Student profile"
            ></PageHeader>
            <Divider />
            <Layout.Content
              className="site-layout"
              style={{ padding: "0 50px", marginTop: 20 }}
            >
              <Row>
                <Col span={4}>
                  <Image
                    width={200}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                </Col>
                <Col span={6}>
                  <Form {...formItemLayout}>
                    <Form.Item label="First Name">
                      <span className="ant-form-text">
                        {this.state.firstName}
                      </span>
                    </Form.Item>
                    <Form.Item label="Last Name">
                      <span className="ant-form-text">
                        {this.state.lastName}
                      </span>
                    </Form.Item>
                    <Form.Item label="Age">
                      <span className="ant-form-text">{this.state.age}</span>
                    </Form.Item>

                    <Form.Item label="E-mail">
                      <span className="ant-form-text">{this.state.email}</span>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        onClick={() => {
                          this.setState({ visibleUpdate: true });
                        }}
                      >
                        Update
                      </Button>
                      ,
                      <Button
                        onClick={() => {
                          this.setState({ visibleDelete: true });
                        }}
                      >
                        Delete
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Modal
                visible={this.state.visibleUpdate}
                title="Update your`s information"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                  this.getUserById();
                  this.setState({ visibleUpdate: false });
                  console.log(this.state.firstName);
                  this.setState({ plaintext: true, update: true });
                }}
                onOk={() => {
                  this.validate.bind(this);
                  if (this.state.validated) {
                    console.log(this.state.firstName);
                  }
                }}
              >
                <Form
                  layout="vertical"
                  initialValues={{
                    modifier: "public",
                    remember: false,
                    ["firstName"]: this.state.firstName,
                  }}
                  name="form_in_modal"
                >
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the name!",
                      },
                    ]}
                  >
                    <Input
                      name="firstName"
                      type="text"
                      defaultValue={"fffffffffffff"}
                      onChange={this.handleChange.bind(this)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="surname"
                    label="Surname"
                    rules={[
                      {
                        required: true,
                        message: "Please input the surname!",
                      },
                    ]}
                  >
                    <Input
                      name="lastName"
                      type="textarea"
                      onChange={this.handleChange.bind(this)}
                      defaultValue={this.state.lastName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="Age"
                    rules={[
                      {
                        required: true,
                        type: "number",
                        min: 0,
                        max: 99,
                      },
                    ]}
                  >
                    <InputNumber
                      name="age"
                      onChange={this.handleChange.bind(this)}
                      defaultValue={this.state.age}
                    />
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Confirm delete"
                visible={this.state.visibleDelete}
                okText="Yes"
                cancelText="No"
                onOk={this.handleDeleteUser.bind(this)}
                onCancel={() => {
                  this.setState({ visibleDelete: false });
                }}
              >
                <p>Do you really want to delete?</p>
              </Modal>
            </Layout.Content>
          </React.Fragment>
        )}
      </Layout>
    );
  }
}

{
  /* {this.state.loading ? (
            <Row className="justify-content-md-center">
              <Spin size="large" />
            </Row>
        ) : (
          <Row noGutters className="justify-content-md-center">
            <Col xs={6}>
              <Form
                style={{ margin: 10 }}
                noValidate
                validated={this.state.validated}
                ref="form"
              >
                <Form.Group as={Row} controlId="formName">
                  <Form.Label className="lbForm" column sm="6">
                    Name
                  </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      required
                      type="text"
                      value={this.state.firstName}
                      name="firstName"
                      onChange={this.handleChange.bind(this)}
                      readOnly={this.state.plaintext}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formSurname">
                  <Form.Label className="lbForm" column sm="6">
                    Surname
                  </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      required
                      type="text"
                      value={this.state.lastName}
                      name="lastName"
                      onChange={this.handleChange.bind(this)}
                      readOnly={this.state.plaintext}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  <Form.Label className="lbForm" column sm="6">
                    Email
                  </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      required
                      type="email"
                      value={this.state.email}
                      name="email"
                      readOnly
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formAge">
                  <Form.Label className="lbForm" column sm="6">
                    Age
                  </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      type="number"
                      value={this.state.age}
                      name="age"
                      onChange={this.handleChange.bind(this)}
                      readOnly={this.state.plaintext}
                    />
                  </Col>
                </Form.Group>
                  <Row className="justify-content-md-center">
                    <Col lg="4">
                      <React.Fragment>
                        {this.state.update ? (
                          <Popconfirm
                            title="Sure to update?"
                            onConfirm={this.handleUpdateUser.bind(this)}
                          >
                            <Button className="udBtn" variant="warning">
                              Update
                            </Button>
                          </Popconfirm>
                        ) : (
                          <Button
                            className="udBtn"
                            variant="warning"
                            onClick={this.handleSaveUpdateUser.bind(this)}
                          >
                            Save
                          </Button>
                        )}
                      </React.Fragment>
                    </Col>
                    <Col lg="4">
                      <React.Fragment>
                        {this.state.update ? (
                          <Popconfirm
                            title="Sure to delete?"
                            onConfirm={this.handleDeleteUser.bind(this)}
                          >
                            <Button className="udBtn" variant="danger">
                              Delete
                            </Button>
                          </Popconfirm>
                        ) : (
                          <Button
                            className="udBtn"
                            variant="danger"
                            onClick={this.handleCancelUpdateUser.bind(this)}
                          >
                            Cancel
                          </Button>
                        )}
                      </React.Fragment>
                    </Col>
                  </Row>
              </Form>
            </Col>
          </Row> */
}

export default withRouter(StudentProfilePage);
