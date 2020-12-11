import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import "./ConfirmEmailPage.css";
import { withRouter } from "react-router";

class ConfirmEmailPage extends React.Component {
  handleSubmit(event) {
    this.props.history.push("/authenticate");
  }

  render() {
    return (
      <Row className="justify-content-md-center">
        <Col xs={3}>
          <h1>Check your email</h1>
          <Button
            className="btnLogin"
            variant="primary"
            onClick={this.handleSubmit.bind(this)}
          >
            Login
          </Button>
        </Col>
      </Row>
    );
  }
}
export default withRouter(ConfirmEmailPage);
