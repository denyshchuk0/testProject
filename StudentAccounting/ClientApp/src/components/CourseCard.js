import React from "react";
import { Card, Button } from "react-bootstrap";
import { withRouter } from "react-router";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      userId: user.id,
    };
  }

  handleSubmit(event) {
    console.log(this.props);
    const request = {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    fetch(
      "https://localhost:44335/users/subscription?userId=" +
        this.state.userId +
        "&coursId=" +
        this.props.courseObj.id,
      request
    ).then((response) =>
      response.json().then((json) => {
        console.log(json);
        if (!response.ok) {
          // window.alert(json.message);
        } else {
          //window.alert(json.message);
        }
      })
    );
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">Cours #{this.props.courseObj.id}</Card.Header>
        <Card.Body>
          <Card.Title>{this.props.courseObj.name}</Card.Title>
          <Card.Text>{this.props.courseObj.description}</Card.Text>
          <Button
            variant="primary"
            courseId={this.props.courseObj.id}
            onClick={this.handleSubmit.bind(this)}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    );
  }
}
export default withRouter(CourseCard);
