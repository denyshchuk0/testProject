import React from "react";
import { Table, message, Layout, Input, Button, Divider } from "antd";
import NavBarMain from "../NavBarMain";
import { BASE_URL } from "../utils";
import moment from "moment";

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
      pageSize: 5,
      loading: false,
      defaultSortOrder: "ascend",
      defaultSortParameter: "Id",
    };
  }

  onSearchParamChange(event) {
    console.log(event.target.value);
    this.props.setSearchParamText(event.target.value);
  }

  componentDidMount() {
    const data = {
      pageSize: this.state.pageSize,
      pageNumber: this.state.pageNumber,
      sortOrder: this.state.defaultSortOrder,
      sortParameter: this.state.defaultSortParameter,
    };
    console.log(data);
    this.getAllUsers(data, "users/all-users");
  }

  handleSeeMore = (key) => {
    this.props.history.push(`/student-profile/${key}`);
  };

  handleSubmit() {
    const data = {
      pageSize: this.state.pageSize,
      pageNumber: this.state.pageNumber,
      sortOrder: this.state.defaultSortOrder,
      sortParameter: this.state.defaultSortParameter,
    };

    this.getAllUsers(
      data,
      "users/search?searchParam=" + this.props.searchParam
    );
  }

  handleChange(pagination, filters, sorter) {
    const data = {
      pageSize: this.state.pageSize,
      pageNumber: pagination.current,
      sortOrder: sorter.order || this.state.defaultSortOrder,
      sortParameter: sorter.columnKey || this.state.defaultSortParameter,
    };
    this.getAllUsers(data, "users/all-users");
  }

  getAllUsers(data, route) {
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    const request = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    fetch(BASE_URL + route, request).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.setState({ loading: false, allUsersCount: json.count });
          const users = json.model;
          users.forEach((user) => {
            user.key = user.id;
            user.registeredDate = moment(new Date(user.registeredDate)).format(
              "DD/MM/YYYY"
            );
            user.courses.forEach((course) => {
              course.startDate = moment(new Date(course.startDate)).format(
                "DD/MM/YYYY"
              );
            });
          });
          this.props.setUsers(users);
        }
      })
    );
  }

  render() {
    return (
      <React.Fragment>
        <Layout className="layout">
          <NavBarMain />
          <Layout.Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
          >
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              value={this.props.searchParam}
              onChange={this.onSearchParamChange.bind(this)}
              onSearch={this.handleSubmit.bind(this)}
            />
            <Table
              onChange={this.handleChange.bind(this)}
              columns={this.state.columnsTmp}
              pagination={{
                defaultCurrent: this.state.pageNumber,
                pageSize: this.state.pageSize,
                total: this.state.allUsersCount,
                showSizeChanger: false,
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
                          title: "Cours name",
                          dataIndex: ["course", "name"],
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
                    {console.log(record.courses)}
                  </div>
                ),
                rowExpandable: (record) => record.courses.length !== 0,
              }}
              expandRowByClick
              dataSource={this.props.users}
              loading={this.state.loading}
            />
            <Divider />
          </Layout.Content>
          <Layout.Footer></Layout.Footer>
        </Layout>
      </React.Fragment>
    );
  }
}
