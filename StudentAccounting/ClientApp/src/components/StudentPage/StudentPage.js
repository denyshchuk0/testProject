import React from "react";
import CourseCard from "./CourseCard";
import { Pagination, Layout, Row, Col, Divider } from "antd";
import { BASE_URL } from "../utils";
import { Spin, message } from "antd";

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
    this.getAllCourses();
  }
  getAllCourses() {
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
    ).then((response) => {
      response.json().then((json) => {
        if (!response.ok) {
          message.info(json.message);
        } else {
          this.props.setCourses(json.model);
          this.setState({ loading: false, coursesCount: json.count });
        }
      });
    });
  }

  onChange(pagination) {
    this.state.startPage = pagination;
    this.getAllCourses();
  }

  render() {
    const courses = this.props.courses;
    return (
      <React.Fragment>
        <Layout.Content style={{ padding: "0 50px" }}>
          {this.state.loading ? (
            <Row>
              <Spin size="large" />
            </Row>
          ) : (
            <Row>
              <Divider orientation="left">Courses</Divider>

              <Col span={18} offset={3}>
                <div>
                  {courses.map((course) => (
                    <CourseCard key={course.id} courseObj={course} />
                  ))}
                  <Pagination
                    onChange={this.onChange.bind(this)}
                    pageSize={2}
                    defaultCurrent={this.state.startPage}
                    total={this.state.coursesCount}
                  />
                </div>
              </Col>
            </Row>
          )}
        </Layout.Content>
      </React.Fragment>
    );
  }
}
