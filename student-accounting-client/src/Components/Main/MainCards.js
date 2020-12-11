import React from "react";
import { Card, Button, Container } from "react-bootstrap";

export default class MainCards extends React.Component {
  render() {
    return (
      <Container>
        <Card>
          <Card.Header as="h5">Cours 1</Card.Header>
          <Card.Body>
            <Card.Title>C#</Card.Title>
            <Card.Text>
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit
            </Card.Text>
            <Button variant="primary">Submit</Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header as="h5">Cours 2</Card.Header>
          <Card.Body>
            <Card.Title>C#</Card.Title>
            <Card.Text>
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit
            </Card.Text>
            <Button variant="primary">Submit</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}
