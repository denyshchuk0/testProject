import React from "react";
import CourseCard from "./../CourseCard";

export default class MainCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${user.token}` }),
    };

    fetch("https://localhost:44335/users/all-courses", request).then(
      (response) =>
        response.json().then((json) => {
          console.log(JSON);
          if (!response.ok) {
            window.alert(json.message);
          } else {
            console.log(json);
            this.setState({ courses: json });
          }
        })
    );
  }

  render() {
    const courses = this.state.courses;
    return (
      <div>
        {courses.map((course) => (
          <CourseCard key={course.id} courseObj={course} />
        ))}
      </div>
    );
  }
}
