import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import './PassengerForm.css';

const PassengerForm = ({ numberOfTickets = 1, onPassengerChange, userEmail  }) => {
  const [passengers, setPassengers] = useState([]);
  const [isBuyingForSelf, setIsBuyingForSelf] = useState(true);

  useEffect(() => {
    console.log('PassengerForm useEffect triggered:', { numberOfTickets, isBuyingForSelf, userEmail });
    
    // Initialize passengers array based on number of tickets
    const initialPassengers = Array(numberOfTickets).fill('').map((_, index) => ({
      id: index + 1,
      email: isBuyingForSelf && userEmail ? userEmail : ''
    }));
    setPassengers(initialPassengers);
    
    console.log('Initial passengers created:', initialPassengers);
    
    // Notify parent component about the initial passengers
    if (onPassengerChange) {
      onPassengerChange(initialPassengers);
    }
  }, [numberOfTickets, isBuyingForSelf, userEmail]);

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

  const handleModeChange = (e) => {
    const mode = e.target.checked;
    setIsBuyingForSelf(mode);
    const updatedPassengers = Array(numberOfTickets).fill('').map((_, index) => ({
      id: index + 1,
      email: mode && userEmail ? userEmail : ''
    }));
    setPassengers(updatedPassengers);
    if (onPassengerChange) {
      onPassengerChange(updatedPassengers);
    }
  };

  return (
    <Card className="passenger-form-card shadow-sm border-0">
      <Card.Body className="p-4">
        <h4 className="mb-4 text-primary fw-bold">Thông tin hành khách</h4>
        
        <div className="booking-mode-section mb-4">
          <Form.Check 
            type="switch"
            id="booking-mode"
            label="Mua vé cho chính mình"
            checked={isBuyingForSelf}
            onChange={handleModeChange}
            className="custom-switch mb-3"
          />
          {isBuyingForSelf && (
            <div className="text-muted small mode-description">
              Email tài khoản của bạn sẽ được sử dụng cho tất cả vé
            </div>
          )}
        </div>

        <Form>
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="passenger-section mb-4">
              <div className="d-flex align-items-center mb-3">
                <h6 className="mb-0 text-muted fw-semibold">Hành khách {index + 1}</h6>
                {index === 0 && (
                  <span className="badge bg-primary ms-2 rounded-pill">Liên hệ chính</span>
                )}
              </div>
              
              <Row>
                <Col>
                  <Form.Group controlId={`email-${index}`}>
                    <Form.Label className="text-muted small">
                      Địa chỉ email
                      {index === 0 && <span className="text-danger ms-1">*</span>}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      required={index === 0}
                      placeholder="Nhập địa chỉ email"
                      value={passenger.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="form-control-custom"
                      disabled={isBuyingForSelf}
                    />
                    {index === 0 && (
                      <Form.Text className="text-muted small">
                        Xác nhận đặt vé sẽ được gửi đến email này
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