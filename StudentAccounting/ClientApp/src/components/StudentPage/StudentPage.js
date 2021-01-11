import React from "react";
import CourseCard from "./CourseCard";
import { Container, Row } from "react-bootstrap";
import { Pagination } from "antd";
import { BASE_URL } from "../utils";
import { Spin } from "antd";

export default class SudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesCount: 0,
      startPage: 1,
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({
      loading: true,
    });
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(
      BASE_URL + "users/all-courses/?page=" + this.state.startPage,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({ loading: false, coursesCount: json.count });

          this.props.setCourses(json.model);
        }
      })
    );
  }

  onChange(pagination) {
    this.setState({
      loading: true,
    });
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    this.state.startPage = pagination;
    fetch(
      BASE_URL + "users/all-courses/?page=" + this.state.startPage,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.setState({
            loading: false,
          });
          this.props.setCourses(json.model);
        }
      })
    );
  }

  render() {
    const courses = this.props.courses;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Container>
            <Row className="justify-content-md-center">
              <Spin size="large" />
            </Row>
          </Container>
        ) : (
          <div>
            {courses.map((course) => (
              <CourseCard key={course.id} courseObj={course} />
            ))}
            <Pagination
              onChange={this.onChange.bind(this)}
              pageSize={1}
              defaultCurrent={this.state.startPage}
              total={this.state.coursesCount}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}
