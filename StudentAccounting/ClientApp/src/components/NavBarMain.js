import React from "react";
//import { Navbar, Nav } from "react-bootstrap";
import { GetRole } from "./utils";
import { Layout, Menu, Divider, Typography, Row, Col } from "antd";
import "../components/style/NavBar.css";

export default class NavBarMain extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      userRole: GetRole(),
    };
  }

  render() {
    const { Header } = Layout;
    return (
      <React.Fragment>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Typography.Text keyboard>Student Accounting</Typography.Text>
            <Divider type="vertical" />
            <React.Fragment>
              {this.state.userRole === "student" ? (
                <Menu.Item>
                  <a href="/main">Courses</a>
                </Menu.Item>
              ) : (
                <Menu.Item>
                  <a href="/admin">Students</a>
                </Menu.Item>
              )}
            </React.Fragment>
            <Menu.Item>
              <a
                href={`/student-profile/${
                  JSON.parse(localStorage.getItem("user")).id
                }`}
              >
                My page
              </a>
            </Menu.Item>
            <Typography.Text code>
              Signed in as: <a href="/">{this.state.email}</a>
            </Typography.Text>
          </Menu>
        </Header>
      </React.Fragment>
    );
  }
}
