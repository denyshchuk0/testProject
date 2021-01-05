import React from "react";
import { Container, Form, FormControl, Button } from "react-bootstrap";
import { Table } from "antd";
import NavBarMain from "../NavBarMain";
import { BASE_URL } from "../utils";

import "antd/dist/antd.css";

export default class AdminPage extends React.Component {
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

    this.onSearchParamChange = this.onSearchParamChange.bind(this);

    this.state = {
      columnsTmp: columns,
      allUsersCount: 0,
      currentPage: 1,
      loading: false,
    };
  }

  onSearchParamChange(event) {
    this.props.setSearchParamText(event.target.value);
  }

  componentDidMount() {
    this.setState({ loading: true });
    const user = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
      }),
    };

    fetch(
      BASE_URL + "users/all-users/?page=" + this.state.currentPage,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({
            loading: false,
            allUsersCount: json.count,
          });

          this.props.setUsers(json.model);
        }
      })
    );
  }

  handleSeeMore = (key) => {
    this.props.history.push(`/student-profile/${key}`);
  };

  handleSubmit() {
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(
      BASE_URL + "users/search?searchParam=" + this.props.searchParam,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({
            loading: false,
          });
          this.props.setUsers(json);
        }
      })
    );
  }

  onChange(pagination) {
    this.setState({ loading: true });
    const user = JSON.parse(localStorage.getItem("user"));
    this.state.currentPage = pagination.current;

    const request = {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
      }),
    };

    fetch(
      BASE_URL + "users/all-users/?page=" + this.state.currentPage,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({ loading: false });
          this.props.setUsers(json.model);
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
        <Table
          onChange={this.onChange.bind(this)}
          columns={this.state.columnsTmp}
          pagination={{
            defaultCurrent: this.state.currentPage,
            pageSize: 3,
            total: this.state.allUsersCount,
          }}
          dataSource={this.props.users}
          loading={this.state.loading}
        />
        ,
      </Container>
    );
  }
}
