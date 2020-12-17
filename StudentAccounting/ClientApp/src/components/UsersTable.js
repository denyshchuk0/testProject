import React from "react";
import { withRouter } from "react-router";

class UsersTable extends React.Component {
  render() {
    console.log(this.props.usersObj);
    return (
      <tr>
        <td>{this.props.usersObj.id}</td>
        <td>{this.props.usersObj.firstName}</td>
        <td>{this.props.usersObj.lastName}</td>
        <td>{this.props.usersObj.age}</td>
        <td>{this.props.usersObj.email}</td>
        <td>{this.props.usersObj.registeredDate}</td>
      </tr>
    );
  }
}
export default withRouter(UsersTable);
