import React, { Component } from "react";
import { Container } from "react-bootstrap";
import CourseCard from "././StudentPage/CourseCard";
import NavBarMain from "./NavBarMain";

export class MainPage extends Component {
  static displayName = MainPage.name;

  render() {
    return (
      <Container>
        <NavBarMain />
        <CourseCard />
      </Container>
    );
  }
}
