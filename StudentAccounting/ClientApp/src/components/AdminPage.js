import React from "react";
import { Table, Container } from "react-bootstrap";
import UsersTable from "./UsersTable";
import NavBarMain from "./Main/NavBarMain";

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
      }),
    };
    console.log(request);
    fetch("https://localhost:44335/users/all-users", request).then((response) =>
      response.json().then((json) => {
        console.log(JSON);
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({ users: json });
        }
      })
    );
  }

  render() {
    const users = this.state.users;
    return (
      <Container>
        <NavBarMain />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UsersTable key={user.id} usersObj={user} />
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
