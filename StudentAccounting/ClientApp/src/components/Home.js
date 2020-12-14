import React, { Component } from "react";
import MainCards from "./Main/MainCards";
import NavBarMain from "./Main/NavBarMain";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <NavBarMain />
        <MainCards />
      </div>
    );
  }
}
