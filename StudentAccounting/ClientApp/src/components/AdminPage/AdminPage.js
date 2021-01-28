import React from "react";
import { Container, Form, FormControl, Button } from "react-bootstrap";
import { Table, message } from "antd";
import NavBarMain from "../NavBarMain";
import { BASE_URL } from "../utils";

import "antd/dist/antd.css";

export default class AdminPage extends React.Component {
  constructor(props) {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        columnKey: "Id",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Name",
        dataIndex: "firstName",
        columnKey: "FirstName",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Surname",
        dataIndex: "lastName",
        columnKey: "LastName",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Age",
        dataIndex: "age",
        columnKey: "Age",

        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Email",
        dataIndex: "email",
        columnKey: "Email",

        sorter: true,
      },
      {
        title: "Registered Date",
        dataIndex: "registeredDate",
        columnKey: "RegisteredDate",

        sorter: true,
        sortDirections: ["descend", "ascend"],
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
      currentPage: this.state.currentPage,
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

    console.log("ddd");
    fetch(BASE_URL + "users/all-users", request).then((response) =>
      response.json().then((json) => {
        console.log("ff");
        if (!response.ok) {
          message.info(json.message);
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
      BASE_URL +
        "users/search?searchParam=" +
        this.props.searchParam +
        "&page=" +
        this.state.currentPage,
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
          this.props.setUsers(json.model);
        }
      })
    );
  }

  handleChange(pagination, filters, sorter) {
    console.log("Various parameters", sorter);
    this.setState({ loading: true });
    const user = JSON.parse(localStorage.getItem("user"));
    const data = {
      currentPage: pagination.current,
      sortOrder: sorter.order || this.state.defaultSortOrder,
      sortParameter: sorter.column
        ? sorter.column.columnKey
        : this.state.defaultSortParameter,
    };

    console.log(data.sortParameter);

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
          onHeaderRow={(columns) => {
            return {
              onClick: (e) => {
                console.log(columns);
              },
            };
          }}
          onChange={this.handleChange.bind(this)}
          columns={this.state.columnsTmp}
          pagination={{
            defaultCurrent: this.state.currentPage,
            pageSize: 3,
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
