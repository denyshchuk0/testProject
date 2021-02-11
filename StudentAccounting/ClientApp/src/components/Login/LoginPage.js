import React from "react";
import "../style/LoginPage.css";
import { BASE_URL } from "../utils";
import { ReactComponent as Logo } from "../img/graduation-hat.svg";
import {
  Form,
  Input,
  Divider,
  Button,
  message,
  Spin,
  Layout,
  Row,
  Col,
  Image,
  Typography,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

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
    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    };
    console.log(request);
    fetch(BASE_URL + route, request).then((response) => {
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.setState({ loading: true });
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
    const { Header, Footer, Sider, Content } = Layout;

    const onFinish = (values) => {
      const data = {
        email: values.email,
        password: values.password,
      };

      this.login("authenticate/authenticate", data);
    };

    return (
      <React.Fragment>
        <Layout>
          <Header>
            <div className="logo">
              <Typography.Text level={5} keyboard>
                Student Accounting
              </Typography.Text>
            </div>
          </Header>
          {this.state.loading ? (
            <Row justify="space-around">
              <Spin size="large" style={{ marginTop: 220 }} />
            </Row>
          ) : (
            <Content style={{ minHeight: 525 }}>
              <Row>
                <Col span={4} offset={10}>
                  <Logo />
                  <Typography.Title level={3}>
                    Student Accounting
                  </Typography.Title>
                  <br />
                  <Form
                    name="normal_login"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Log in
                      </Button>
                      <Button
                        type="primary"
                        className="facebook-form-button"
                        onClick={this.handleFacebook.bind(this)}
                      >
                        Facebook
                      </Button>
                      <Divider plain>Or</Divider>

                      <Button
                        type="link"
                        block
                        onClick={this.handleRegistry.bind(this)}
                      >
                        register now!
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Content>
          )}
          <Footer style={{ textAlign: "center" }}>2021</Footer>
        </Layout>
      </React.Fragment>
    );
  }
}
