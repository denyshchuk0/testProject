import React from "react";
import NavBarMain from "../NavBarMain";
import anon from "../img/anon.svg";
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
} from "antd";
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

  handleCancelUpdateUser() {
    this.getUserById();
    this.setState({ visibleUpdate: false });
  }

  getUserById() {
    this.setState({ loading: true });

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
          response.json().then((data) => {
            this.setState({
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              age: parseInt(data.age, 10),
              email: data.email,
              loading: false,
            });
          });
        }
      }
    );
  }

  handleSaveUpdateUser = () => {
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

          this.setState({ visibleUpdate: false });
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
        <Layout.Content className="site-layout" style={{ minHeight: 530 }}>
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="Home"
            subTitle="Student profile"
          ></PageHeader>
          <Divider />
          {this.state.loading ? (
            <Row justify="space-around">
              <Spin size="large" style={{ marginTop: 220 }} />
            </Row>
          ) : (
            <React.Fragment>
              <div style={{ marginTop: 30 }}>
                <Row>
                  <Col span={4} offset={3}>
                    <Image width={200} src={anon} />
                  </Col>
                  <Col span={7}>
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
                        <span className="ant-form-text">
                          {this.state.email}
                        </span>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="udBtn"
                          onClick={() => {
                            this.setState({ visibleUpdate: true });
                          }}
                        >
                          Update
                        </Button>
                        ,
                        <Button
                          className="udBtn"
                          danger
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
                  destroyOnClose={true}
                  onCancel={() => {
                    this.getUserById();
                    this.setState({ visibleUpdate: false });
                  }}
                  onOk={() => {
                    this.validate();
                    if (this.state.validated) {
                      this.handleSaveUpdateUser();
                    }
                  }}
                >
                  <Form
                    layout="vertical"
                    initialValues={{
                      modifier: "public",
                      remember: false,
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
                        defaultValue={this.state.firstName}
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
              </div>
            </React.Fragment>
          )}
        </Layout.Content>
        <Divider />

        <Layout.Footer style={{ textAlign: "center" }}>Help!</Layout.Footer>
      </Layout>
    );
  }
}

export default withRouter(StudentProfilePage);
