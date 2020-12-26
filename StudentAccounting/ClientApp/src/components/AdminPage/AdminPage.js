import React from "react";
import { Container, Form, FormControl, Button } from "react-bootstrap";
import { Table } from "antd";
import NavBarMain from "../NavBarMain";
import "antd/dist/antd.css";

export default class AdminPage extends React.Component {
  constructor(props) {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "0",
        sorter: (a, b) => a.id - b.id,
        sortDirections: ["descend"],
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "1",
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Surname",
        dataIndex: "lastName",
        key: "2",
        sorter: (a, b) => a.lastName.length - b.lastName.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "3",
        sorter: (a, b) => a.age - b.age,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "4",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.email - b.email,
      },
      {
        title: "RegDate",
        dataIndex: "registeredDate",
        defaultSortOrder: "descend",
        key: "5",
        sorter: (a, b) => a.registeredDate - b.registeredDate,
      },
      {
        title: "Action",
        dataIndex: "",
        key: "6",
        render: (record) => (
          <Button onClick={() => this.handleSeeMore(record.id)}>
            See more
          </Button>
        ),
      },
    ];
    super(props);

    this.onSearchParamChange = this.onSearchParamChange.bind(this);

    this.state = {
      columnsTmp: columns,
    };
  }

  onSearchParamChange(event) {
    this.props.setSearchParamText(event.target.value);
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
      }),
    };

    fetch("https://localhost:44335/users/all-users", request).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          {
            this.props.setUsers(json);
          }
        }
      })
    );
  }

  handleSeeMore = (key) => {
    const dataSource = [...this.props.users];
    const userObj = dataSource.find((item) => item.id === key);
    this.props.history.push({
      pathname: "/student-profile",
      state: { user: userObj },
    });
  };

  handleSubmit() {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(
      "https://localhost:44335/users/search?searchParam=" +
        this.props.searchParam,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.props.setUsers(json);
        }
      })
    );
  }

  render() {
    return (
      <Container>
        <NavBarMain />
        <Form inline style={{ float: "right" }}>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={this.props.searchParam}
            name="searchParam"
            onChange={this.onSearchParamChange}
          />
          <Button
            variant="outline-success"
            onClick={this.handleSubmit.bind(this)}
          >
            Search
          </Button>
        </Form>
        <Table columns={this.state.columnsTmp} dataSource={this.props.users} />,
      </Container>
    );
  }
}
