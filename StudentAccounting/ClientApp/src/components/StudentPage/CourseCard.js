import React from "react";
import { Card, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { BASE_URL } from "../utils";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      userId: user.id,
      color: "primary",
    };
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
        window.alert(response.message);
      } else {
        this.setState({ color: "success" });
        window.alert("You have signed up for the course.");
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
            courseId={this.props.courseObj.id}
            onClick={this.handleSubmit.bind(this)}
          >
            Sub.
          </Button>
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(CourseCard);
