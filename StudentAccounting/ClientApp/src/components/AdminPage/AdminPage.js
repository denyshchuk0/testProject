import React from "react";
import { Container, Form, FormControl, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { Table } from "antd";
import NavBarMain from "../NavBarMain";
import "antd/dist/antd.css";

class AdminPage extends React.Component {
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
    const userObj = dataSource.find((item) => item.id === key);
    this.props.history.push({
      pathname: "/student-profile",
      state: { user: userObj },
    });
  };

  onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  handleSubmit() {
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
        <Form inline style={{ float: "right" }}>
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
        <Table
          columns={this.state.columnsTmp}
          dataSource={users}
          onChange={this.onChange.bind(this)}
        />
        ,
      </Container>
    );
  }
}
export default withRouter(AdminPage);
