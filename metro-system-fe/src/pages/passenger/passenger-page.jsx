import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PassengerForm from '../../components/passenger/PassengerForm';
import PaymentMethodList from '../../components/passenger/PaymentMethodList';
import TicketSummary from '../../components/passenger/TicketSummary';

const PassengerPage = () => {
  return (
    <Container className="py-4">
      <Row>
        {/* Left Section */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <PassengerForm />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <PaymentMethodList />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Section */}
        <Col md={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <TicketSummary />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PassengerPage;
