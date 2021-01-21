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

        sorter: (a, b) => a.id - b.id,
        sortDirections: ["descend"],
      },
      {
        title: "Name",
        dataIndex: "firstName",
        sorter: (a) => {
          console.log("ff");
        },
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
        title: "Registered Date",
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
      sortOrder: "",
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
    console.log("ddd");
    fetch(
      BASE_URL + "users/all-users/?page=" + this.state.currentPage,
      request
    ).then((response) =>
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
          console.log(json.model);
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
          message.info(json.message);
        } else {
          this.setState({ loading: false });
          console.log(json.model);
          this.props.setUsers(json.model);
        }
      })
    );
  }

  render() {
    const expandedRowRender = () => {
      const columns = [
        { title: "Start Date", dataIndex: "startDate" },
        { title: "Name", dataIndex: "id" },
      ];

      const data = [];
      this.props.users.forEach((user) => {
        data.push(user.courses);
      });

      console.log(data);
      return <Table columns={columns} dataSource={data} pagination={false} />;
    };

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
          onHeaderRow={(column) => {
            return {
              onClick: () => {
                console.log(column);
              },
            };
          }}
          onChange={this.onChange.bind(this)}
          columns={this.state.columnsTmp}
          pagination={{
            defaultCurrent: this.state.currentPage,
            pageSize: 3,
            total: this.state.allUsersCount,
          }}
          expandable={{
            expandedRowRender: (record) =>
              record.courses.map((element) => (
                <p style={{ margin: 0 }}>
                  couse id: {element.id}// start date:
                  {element.startDate}
                </p>
              )),
            rowExpandable: (record) => record.courses.length !== 0,
          }}
          dataSource={this.props.users}
          loading={this.state.loading}
        />
        ,
      </Container>
    );
  }
}
