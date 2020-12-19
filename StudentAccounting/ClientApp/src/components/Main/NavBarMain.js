import React from "react";
import { Navbar, Nav } from "react-bootstrap";

export default class NavBarMain extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      email: user.email,
      password: "",
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
              <Nav.Link href="/student-profile">My page</Nav.Link>
            </Nav>
            <Navbar.Text>
              Signed in as: <a href="/">{this.state.email}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
