import React from "react";
import "../style/ConfirmEmailPage.css";
import { withRouter } from "react-router";
import { Result, Button, Layout, Typography, Divider } from "antd";

class ConfirmEmailPage extends React.Component {
  handleSubmit() {
    this.props.history.push("/");
  }

  render() {
    return (
      <Layout>
        <Layout.Header>
          <div className="logo">
            <Typography.Text level={5} keyboard>
              Student Accounting
            </Typography.Text>
          </div>
        </Layout.Header>
        <Layout.Content className="site-layout" style={{ minHeight: 530 }}>
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
        </Layout.Content>
        <Divider />
        <Layout.Footer style={{ textAlign: "center" }}>Help!</Layout.Footer>
      </Layout>
    );
  }
}
export default withRouter(ConfirmEmailPage);
