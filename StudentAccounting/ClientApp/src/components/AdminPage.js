import React from "react";
import {
  Table,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import UsersTable from "./UsersTable";
//import { Table } from "antd";
import NavBarMain from "./Main/NavBarMain";
import "antd/dist/antd.css";

export default class AdminPage extends React.Component {
  constructor(props) {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend"],
      },
      {
        title: "Age",
        dataIndex: "age",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: "Address",
        dataIndex: "address",
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ["descend", "ascend"],
      },
    ];
    super(props);
    this.state = {
      users: [],
      searchParam: "",
      columnsTmp: columns,
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

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handleSubmit(event) {
    const userTmp = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${userTmp.token}` }),
    };

    console.log(this.state.searchParam);
    fetch(
      "https://localhost:44335/users/search?searchParam=" +
        this.state.searchParam,
      request
    ).then((response) =>
      response.json().then((json) => {
        console.log(JSON);
        if (!response.ok) {
          window.alert(json.message);
        } else {
          console.log(json);
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
        <Form inline>
          <Dropdown>
            <Dropdown.Toggle
              className="drobBtn"
              variant="success"
              id="dropdown-basic"
            >
              Sort by
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Name</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={this.state.searchParam}
            name="searchParam"
            onChange={this.handleChange.bind(this)}
          />
          <Button
            variant="outline-success"
            onClick={this.handleSubmit.bind(this)}
          >
            Search
          </Button>
        </Form>
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
            {/* <Table columns={this.state.columnsTmp} dataSource={users} />, */}
            {users.map((user) => (
              <UsersTable key={user.id} usersObj={user} />
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
