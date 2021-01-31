import React from "react";
import { Container, Form, FormControl, Button } from "react-bootstrap";
import { Table, message } from "antd";
import NavBarMain from "../NavBarMain";
import { BASE_URL } from "../utils";
import moment from "moment";

import "antd/dist/antd.css";

export default class AdminPage extends React.Component {
  constructor(props) {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "Id",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "FirstName",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Surname",
        dataIndex: "lastName",
        key: "LastName",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "Age",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "Email",

        sorter: true,
      },
      {
        title: "Registered Date",
        dataIndex: "registeredDate",
        key: "RegisteredDate",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",

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
      pageNumber: 1,
      pageSize: 3,
      loading: false,
      defaultSortOrder: "ascend",
      defaultSortParameter: "Id",
    };
  }

  onSearchParamChange(event) {
    this.props.setSearchParamText(event.target.value);
  }

  componentDidMount() {
    this.setState({ loading: true });
    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      pageSize: this.state.pageSize,
      pageNumber: this.state.pageNumber,
      sortOrder: this.state.defaultSortOrder,
      sortParameter: this.state.defaultSortParameter,
    };

    const request = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + "users/all-users", request).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.setState({
            loading: false,
            allUsersCount: json.count,
          });
          const users = json.model;
          users.forEach((user) => {
            user.key = user.id;
            user.registeredDate = moment(new Date(user.registeredDate)).format(
              "DD/MM/YYYY"
            );
          });
          this.props.setUsers(users);
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
    const data = {
      pageSize: this.state.pageSize,
      pageNumber: this.state.pageNumber,
      sortOrder: this.state.defaultSortOrder,
      sortParameter: this.state.defaultSortParameter,
    };

    const request = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    fetch(
      BASE_URL + "users/search?searchParam=" + this.props.searchParam,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.setState({
            loading: false,
            allUsersCount: json.count,
          });
          const users = json.model;
          users.forEach((user) => {
            user.key = user.id;
            user.registeredDate = moment(new Date(user.registeredDate)).format(
              "DD/MM/YYYY"
            );
          });
          this.props.setUsers(users);
        }
      })
    );
  }

  handleChange(pagination, filters, sorter) {
    console.log("Various parameters", sorter);
    this.setState({ loading: true });
    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      pageSize: this.state.pageSize,
      pageNumber: pagination.current,
      sortOrder: sorter.order || this.state.defaultSortOrder,
      sortParameter: sorter.columnKey || this.state.defaultSortParameter,
    };

    const request = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + "users/all-users", request).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.setState({ loading: false });
          const users = json.model;
          users.forEach((user) => {
            user.key = user.id;
            user.registeredDate = moment(new Date(user.registeredDate)).format(
              "DD/MM/YYYY"
            );
          });
          this.props.setUsers(users);
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
          onChange={this.handleChange.bind(this)}
          columns={this.state.columnsTmp}
          pagination={{
            defaultCurrent: this.state.pageNumber,
            pageSize: this.state.pageSize,
            total: this.state.allUsersCount,
          }}
          defaultExpandAllRows={false}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Table
                  columns={[
                    {
                      title: "Id Cours",
                      dataIndex: "id",
                    },
                    {
                      title: "Start Date",
                      dataIndex: "startDate",
                    },
                  ]}
                  dataSource={record.courses}
                  size="small"
                  pagination={false}
                />
              </div>
            ),
            rowExpandable: (record) => record.courses.length !== 0,
          }}
          expandRowByClick
          dataSource={this.props.users}
          loading={this.state.loading}
        />
        ,
      </Container>
    );
  }
}
