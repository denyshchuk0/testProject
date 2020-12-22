import React from "react";
import { withRouter } from "react-router";

class UsersTable extends React.Component {
  handleSelect(event) {
    this.props.history.push({
      pathname: "/student-profile",
      state: { user: this.props.usersObj },
    });
  }

  render() {
    return (
      <tr onClick={this.handleSelect.bind(this)}>
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
