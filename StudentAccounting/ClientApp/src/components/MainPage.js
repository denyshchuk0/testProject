import React, { Component } from "react";
import { Container } from "react-bootstrap";
import StudentPageContainer from "././StudentPage/StudentPageContainer";
import NavBarMain from "./NavBarMain";

export default class MainPage extends Component {
  static displayName = MainPage.name;

  render() {
    return (
      <Container>
        <NavBarMain />
        <StudentPageContainer />
      </Container>
    );
  }
}
