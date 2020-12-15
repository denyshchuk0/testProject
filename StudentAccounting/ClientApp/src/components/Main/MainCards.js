import React from "react";
import { Container } from "react-bootstrap";
import CourseCard from "./../CourseCard";

export default class MainCards extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    const data = {
      courses: this.state.courses,
    };

    const request = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
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
      <Container>
        {courses.map((course) => (
          <CourseCard key={course.id} courseObj={course} />
        ))}
      </Container>
    );
  }
}
