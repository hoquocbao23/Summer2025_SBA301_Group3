import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

const BookingSummary = () => {
  return (
    <Container className="my-4" style={{ maxWidth: 370 }}>
      <Card
        style={{
          background: '#fff',
          color: '#0077b6',
          border: 'none',
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        }}
      >
        <Card.Body>
          <h5 className="mb-3 text-center" style={{ color: '#0077b6', fontWeight: 700, letterSpacing: 1 }}>Summary</h5>
          {/* There */}
          <Card className="mb-3" style={{ background: '#fff', border: '1px solid #90e0ef', borderRadius: 12 }}>
            <Card.Body>
              <Row>
                <Col xs={2}><span role="img" aria-label="go">➡️</span></Col>
                <Col><b style={{ color: '#0077b6' }}>There</b></Col>
              </Row>
              <div className="mt-2">
                <div style={{ fontSize: 12, color: '#48cae4' }}>Train Name</div>
                <div style={{ fontWeight: 600, color: '#0077b6' }}>048A North Express</div>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    
                    <div style={{ fontSize: 12, color: '#48cae4' }}>New York</div>
                  </div>
                  <div className="text-center" style={{ fontSize: 12, color: '#0077b6' }}>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#48cae4' }}>Los Angeles</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          {/* Passengers */}
          <Card className="mb-3" style={{ background: '#fff', border: '1px solid #90e0ef', borderRadius: 12 }}>
            <Card.Body>
              <Row>
                <Col xs={2}><span role="img" aria-label="passenger">👤</span></Col>
                <Col><b style={{ color: '#0077b6' }}>Passengers</b></Col>
              </Row>
              <div className="mt-2 d-flex justify-content-between">
                <div style={{ color: '#0077b6' }}>1 Adult</div>
                <div style={{ color: '#0077b6' }}>$260</div>
              </div>
            </Card.Body>
          </Card>
          {/* Total */}
          <div
            className="d-flex justify-content-between align-items-center mt-3"
            style={{
              fontWeight: 700,
              fontSize: 20,
              background: '#e0f7fa',
              borderRadius: 10,
              padding: '10px 18px',
              boxShadow: '0 2px 8px 0 rgba(0,119,182,0.07)',
            }}
          >
            <span style={{ color: '#0077b6', letterSpacing: 1 }}>Total</span>
            <span style={{ color: '#00b4d8', fontSize: 22 }}>$304.00</span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingSummary;