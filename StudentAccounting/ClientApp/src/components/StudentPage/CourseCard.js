import React from "react";
import moment from "moment";

import { Card } from "react-bootstrap";
import { withRouter } from "react-router";
import { BASE_URL } from "../utils";
import { message, DatePicker, Divider, Button, Row, Col, Tag } from "antd";

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
      startDate: "",
      defaultDate: "",
    };
  }

  componentDidMount() {
    const courses = this.state.userCourses;
    {
      courses.map((course) => {
        if (course.id === this.props.courseObj.id) {
          this.setState({
            color: "success",
            disabled: true,
            subscribe: true,
            defaultDate: course.startDate,
          });
        }
      });
    }
  }

  onChange(date, dateString) {
    this.state.startDate = dateString;
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
      BASE_URL +
        "users/subscribe?coursId=" +
        this.props.courseObj.id +
        "&startDate=" +
        this.state.startDate,
      request
    ).then((response) => {
      if (!response.ok) {
        message.info(response.message);
      } else if (!this.state.subscribe) {
        this.setState({
          color: "success",
          subscribe: true,
          disabled: true,
          defaultDate: this.state.startDate,
        });
        this.state.userCourses.push(this.props.courseObj);
        localStorage.setItem("courses", JSON.stringify(this.state.userCourses));
        message.info("You have signed up for the course");
      }
    });
  }

  render() {
    return (
      <div>
        <Card style={{ margin: 20 }}>
          <Card.Header as="h5">
            <Row>
              <Col span={12}>Cours #{this.props.courseObj.id}</Col>
              <Col span={6} offset={6}>
                <Tag hidden={!this.state.disabled} color="success">
                  you are subscribed to this course
                </Tag>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Title>{this.props.courseObj.name}</Card.Title>
            <Card.Text>{this.props.courseObj.description}</Card.Text>
            <Button
              type="primary"
              variant={this.state.color}
              disabled={this.state.disabled}
              courseid={this.props.courseObj.id}
              onClick={this.handleSubmit.bind(this)}
            >
              Subscribe
            </Button>
            <DatePicker
              style={{ margin: 5 }}
              disabledDate={this.disabledDate.bind(this)}
              defaultValue={this.state.defaultDate}
              onChange={this.onChange.bind(this)}
              disabled={this.state.disabled}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
}
export default withRouter(CourseCard);
