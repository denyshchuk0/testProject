import React from "react";
import CourseCard from "./CourseCard";
import { Pagination } from "antd";

export default class SudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesCount: 0,
      startPage: 1,
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(
      "https://localhost:44335/users/all-courses/?page=" + this.state.startPage,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.state.coursesCount = json.count;
          console.log(this.state.coursesCount);
          this.props.setCourses(json.model);
        }
      })
    );
  }

  onChange(pagination) {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    console.log(pagination);
    fetch(
      "https://localhost:44335/users/all-courses/?page=" + pagination,
      request
    ).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          window.alert(json.message);
        } else {
          this.props.setCourses(json.model);
        }
      })
    );
  }
  render() {
    const courses = this.props.courses;
    return (
      <div>
        {courses.map((course) => (
          <CourseCard key={course.id} courseObj={course} />
        ))}
        <Pagination
          onChange={this.onChange.bind(this)}
          pageSize={1}
          total={this.state.coursesCount}
        />
      </div>
    );
  }
}
