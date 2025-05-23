import React from 'react';
import { Card, Row, Col, Form, Button, Dropdown, DropdownButton, InputGroup } from 'react-bootstrap';
import { FaMinusCircle, FaTimes } from 'react-icons/fa';

const ageOptions = [
  '0-12', '13-17', '18-64', '65+'
];
const docTypes = ['Passport', 'ID Card', 'Driver License'];

const PassengerForm = ({ passengerNumber = 1, onRemove }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom">
        <div className="d-flex align-items-center">
          <FaMinusCircle className="me-2 text-secondary" />
          <span className="fw-semibold">Passenger {passengerNumber}</span>
        </div>
        <Button variant="link" className="text-danger p-0 fs-5" onClick={onRemove} aria-label="Remove">
          Remove <FaTimes />
        </Button>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="age">
                <Form.Label>Age</Form.Label>
                <Form.Select>
                  <option value="">Select</option>
                  {ageOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Check type="checkbox" label="Reduced mobility" id="reducedMobility" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="docType">
                <Form.Label>Document Type</Form.Label>
                <Form.Select>
                  <option value="">Select</option>
                  {docTypes.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end">
            <Button variant="outline-dark" type="submit">Next Passenger</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PassengerForm; 