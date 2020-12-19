import React, { Component } from "react";
import { Container } from "react-bootstrap";
import MainCards from "./Main/MainCards";
import NavBarMain from "./Main/NavBarMain";

export class MainPage extends Component {
  static displayName = MainPage.name;

  render() {
    return (
      <Container>
        <NavBarMain />
        <MainCards />
      </Container>
    );
  }
}
