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
        <Layout.Content style={{ minHeight: 525 }}>
          <Divider orientation="left">Courses</Divider>

          {this.state.loading ? (
            <Row justify="space-around">
              <Spin size="large" style={{ marginTop: 220 }} />
            </Row>
          ) : (
            <Row>
              <Col span={18} offset={3}>
                <div>
                  {courses.map((course) => (
                    <CourseCard key={course.id} courseObj={course} />
                  ))}
                  <Row justify="end" style={{ marginRight: 20 }}>
                    <Pagination
                      onChange={this.onChange.bind(this)}
                      pageSize={2}
                      defaultCurrent={this.state.startPage}
                      total={this.state.coursesCount}
                    />
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>Help!</Layout.Footer>
      </React.Fragment>
    );
  }
}
