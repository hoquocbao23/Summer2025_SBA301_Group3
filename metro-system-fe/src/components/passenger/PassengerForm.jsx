import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';

const PassengerForm = ({ numberOfTickets = 1, onPassengerChange }) => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    // Initialize passengers array based on number of tickets
    const initialPassengers = Array(numberOfTickets).fill('').map((_, index) => ({
      id: index + 1,
      email: ''
    }));
    setPassengers(initialPassengers);
  }, [numberOfTickets]);

  const handleEmailChange = (index, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      email: value
    };
    setPassengers(updatedPassengers);
    if (onPassengerChange) {
      onPassengerChange(updatedPassengers);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-4 text-primary">Passenger Information</h4>
        <Form>
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="passenger-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <h6 className="mb-0 text-muted">Passenger {index + 1}</h6>
                {index === 0 && (
                  <span className="badge bg-primary ms-2">Primary Contact</span>
                )}
              </div>
              
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId={`email-${index}`}>
                    <Form.Label className="text-muted">
                      Email Address
                      {index === 0 && (
                        <span className="text-danger ms-1">*</span>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      required={index === 0}
                      placeholder="Enter email address"
                      value={passenger.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="border-0 shadow-sm"
                    />
                    {index === 0 && (
                      <Form.Text className="text-muted">
                        Booking confirmation will be sent to this email
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              
              {index < passengers.length - 1 && (
                <hr className="my-4" />
              )}
            </div>
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PassengerForm; 