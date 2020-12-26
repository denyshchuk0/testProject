import React from "react";
import CourseCard from "./CourseCard";

export default class SudentPage extends React.Component {
  componentDidMount() {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch("https://localhost:44335/users/all-courses", request).then(
      (response) =>
        response.json().then((json) => {
          if (!response.ok) {
            window.alert(json.message);
          } else {
            this.props.setCourses(json);
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
      </div>
    );
  }
}
