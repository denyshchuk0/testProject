import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../style/ConfirmEmailPage.css";
import { withRouter } from "react-router";

class ConfirmEmailPage extends React.Component {
  handleSubmit() {
    this.props.history.push("/");
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <h1>Check your email</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button
              className="btnLogin"
              variant="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withRouter(ConfirmEmailPage);
