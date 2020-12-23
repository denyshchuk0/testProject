import React from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class NavBarMain extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
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
              <Nav.Link href="/main">Courses</Nav.Link>

              <Nav.Link
                as={Link}
                to={{
                  pathname: "/student-profile",
                  state: { user: JSON.parse(localStorage.getItem("user")) },
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
