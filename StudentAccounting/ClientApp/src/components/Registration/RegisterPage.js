import React from "react";
//import { Form, Button, Col } from "react-bootstrap";
import { BASE_URL } from "../utils";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Layout,
  Button,
  message,
  InputNumber,
  Typography,
} from "antd";

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

  handleSubmit = (data) => {};

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const onFinish = (values) => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        email: values.email,
        password: values.password,
      };

      console.log(data);
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
    const { Header, Footer, Sider, Content } = Layout;

    return (
      <Layout>
        <Header>
          <div className="logo">
            <Typography.Text level={5} keyboard>
              Student Accounting
            </Typography.Text>
          </div>
        </Header>
        <Content>
          <Row>
            <Col span={7} offset={11}>
              <br />
              <Typography.Title>Registration</Typography.Title>
            </Col>
            <Col span={8} offset={8}>
              <Form
                {...formItemLayout}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
              >
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="E-mail"
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
                  <Input />
                </Form.Item>

                <Form.Item
                  name="age"
                  label="Age"
                  rules={[{ type: "number", min: 0, max: 99 }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
        <Footer>2021</Footer>
      </Layout>
    );
  }
}
