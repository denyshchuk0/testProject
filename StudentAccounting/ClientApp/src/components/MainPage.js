import React, { Component } from "react";
import StudentPageContainer from "././StudentPage/StudentPageContainer";
import NavBarMain from "./NavBarMain";
import { message, Layout, Input, Button, Divider } from "antd";

export default class MainPage extends Component {
  static displayName = MainPage.name;

  render() {
    return (
      <Layout>
        <NavBarMain />
        <StudentPageContainer />
      </Layout>
    );
  }
}
