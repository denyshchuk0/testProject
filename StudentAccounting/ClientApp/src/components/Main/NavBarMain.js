import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

export default class NavBarMain extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      firstName: "",
      lastName: "",
      age: "",
      email: user.email,
      password: "",
    };
    console.log(user.email);
  }

  render() {
    return (
      <Container>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="">Student Accounting</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">{this.state.email}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}
