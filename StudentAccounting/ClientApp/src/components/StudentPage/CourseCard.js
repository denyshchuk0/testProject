import React from "react";
import moment from "moment";

import { Card, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { BASE_URL } from "../utils";
import { message, DatePicker } from "antd";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    const courses = JSON.parse(localStorage.getItem("courses"));
    this.state = {
      userId: user.id,
      subscribe: false,
      userCourses: courses,
      color: "primary",
      disabled: false,
    };
  }

  componentDidMount() {
    const courses = this.state.userCourses;
    {
      courses.map((course) => {
        if (course.id === this.props.courseObj.id) {
          this.setState({ color: "success", disabled: true, subscribe: true });
        }
      });
    }
  }

  onChange(date, dateString) {
    console.log(date, dateString);
  }
  disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  handleSubmit() {
    const token = localStorage.getItem("token");
    const request = {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    };

    fetch(
      BASE_URL + "users/subscribe?coursId=" + this.props.courseObj.id,
      request
    ).then((response) => {
      if (!response.ok) {
        message.info(response.message);
      } else if (!this.state.subscribe) {
        this.setState({ color: "success", subscribe: true });
        this.state.userCourses.push(this.props.courseObj);
        localStorage.setItem("courses", JSON.stringify(this.state.userCourses));
        message.info("You have signed up for the course");
      }
    });
  }

  render() {
    return (
      <Card style={{ margin: 10 }}>
        <Card.Header as="h5">Cours #{this.props.courseObj.id}</Card.Header>
        <Card.Body>
          <Card.Title>{this.props.courseObj.name}</Card.Title>
          <Card.Text>{this.props.courseObj.description}</Card.Text>
          <Button
            variant={this.state.color}
            disabled={this.state.disabled}
            courseId={this.props.courseObj.id}
            onClick={this.handleSubmit.bind(this)}
          >
            Sub.
          </Button>
          <DatePicker
            style={{ margin: 5 }}
            disabled
            disabledDate={this.disabledDate.bind(this)}
          />
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(CourseCard);
