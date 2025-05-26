import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const PassengerForm = () => {
  return (
    <div>
      <h5 className="mb-3">Passenger Information</h5>
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" required />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PassengerForm; 