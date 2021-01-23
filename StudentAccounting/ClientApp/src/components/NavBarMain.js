import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GetRole } from "./utils";

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
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="">Student Accounting</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <React.Fragment>
                {this.state.userRole === "student" ? (
                  <Nav.Link href="/main">Courses</Nav.Link>
                ) : (
                  <Nav.Link href="/admin">Students</Nav.Link>
                )}
              </React.Fragment>

              <Nav.Link
                as={Link}
                to={{
                  pathname: `/student-profile/${
                    JSON.parse(localStorage.getItem("user")).id
                  }`,
                }}
              >
                My page
              </Nav.Link>
            </Nav>

            <Navbar.Text style={{ margin: 10 }}>
              Signed in as: <a href="/">{this.state.email}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
