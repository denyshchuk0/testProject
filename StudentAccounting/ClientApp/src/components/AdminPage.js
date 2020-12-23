import React from "react";
import {
  // Table,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Route, withRouter } from "react-router-dom";

import UsersTable from "./UsersTable";
import { Table, Popconfirm } from "antd";
import NavBarMain from "./Main/NavBarMain";
import "antd/dist/antd.css";

class AdminPage extends React.Component {
  constructor(props) {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id,
        sortDirections: ["descend"],
      },
      {
        title: "Name",
        dataIndex: "firstName",
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Surname",
        dataIndex: "lastName",

        sorter: (a, b) => a.lastName.length - b.lastName.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Age",
        dataIndex: "age",
        sorter: (a, b) => a.age - b.age,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Email",
        dataIndex: "email",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.email - b.email,
      },
      {
        title: "RegDate",
        dataIndex: "registeredDate",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.registeredDate - b.registeredDate,
      },
      {
        title: "Action",
        dataIndex: "",

        render: (record) => (
          <Button onClick={() => this.handleSeeMore(record.id)}>
            See more
          </Button>
        ),
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

  handleSeeMore = (key) => {
    const dataSource = [...this.state.users];
    const userObj = dataSource.find((item) => item.id == key);
    console.log(userObj);

    this.props.history.push({
      pathname: "/student-profile",
      state: { user: userObj },
    });
  };

  onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

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
        {/* <Table striped bordered hover>
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
          <tbody> */}
        <Table
          columns={this.state.columnsTmp}
          dataSource={users}
          onChange={this.onChange.bind(this)}
        />
        ,
        {/* {users.map((user) => (
              <UsersTable key={user.id} usersObj={user} />
            ))}
          </tbody> */}
        {/* </Table> */}
      </Container>
    );
  }
}
export default withRouter(AdminPage);
