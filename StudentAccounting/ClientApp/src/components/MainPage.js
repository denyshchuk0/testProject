import React, { Component } from "react";
import MainCards from "./Main/MainCards";
import NavBarMain from "./Main/NavBarMain";

export class MainPage extends Component {
  static displayName = MainPage.name;

  render() {
    return (
      <div>
        <NavBarMain />
        <MainCards />
      </div>
    );
  }
}
