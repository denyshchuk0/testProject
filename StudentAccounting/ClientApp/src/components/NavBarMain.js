import React from "react";
//import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GetRole } from "./utils";
import { Layout, Menu, Breadcrumb, Typography } from "antd";
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
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Typography.Text keyboard>Student Accounting</Typography.Text>
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
          <Typography.Text style={{ margin: 10 }}>
            Signed in as: <a href="/">{this.state.email}</a>
          </Typography.Text>
        </Menu>
      </Header>

      // <div>
      //   <Navbar bg="light" expand="lg">
      //     <Navbar.Brand href="">Student Accounting</Navbar.Brand>
      //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
      //     <Navbar.Collapse id="basic-navbar-nav">
      //       <Nav className="mr-auto">
      //         <React.Fragment>
      //           {this.state.userRole === "student" ? (
      //             <Nav.Link href="/main">Courses</Nav.Link>
      //           ) : (
      //             <Nav.Link href="/admin">Students</Nav.Link>
      //           )}
      //         </React.Fragment>

      //         <Nav.Link
      //           as={Link}
      //           to={{
      //             pathname: `/student-profile/${
      //               JSON.parse(localStorage.getItem("user")).id
      //             }`,
      //           }}
      //         >
      //           My page
      //         </Nav.Link>
      //       </Nav>

      //       <Navbar.Text style={{ margin: 10 }}>
      //         Signed in as: <a href="/">{this.state.email}</a>
      //       </Navbar.Text>
      //     </Navbar.Collapse>
      //   </Navbar>
      // </div>
    );
  }
}
