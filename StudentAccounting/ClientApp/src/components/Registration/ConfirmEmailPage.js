import React from "react";
import { Container } from "react-bootstrap";
import "../style/ConfirmEmailPage.css";
import { withRouter } from "react-router";
import { Result, Button } from "antd";

class ConfirmEmailPage extends React.Component {
  handleSubmit() {
    this.props.history.push("/");
  }

  render() {
    return (
      <Container>
        <Result
          status="success"
          title="Registration was successful!"
          subTitle="An email has been sent to you with a confirmation link."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={this.handleSubmit.bind(this)}
            >
              Go Login
            </Button>,
          ]}
        />
        ,
      </Container>
    );
  }
}
export default withRouter(ConfirmEmailPage);
