import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PassengerForm from '../../components/passenger/PassengerForm';
// import PaymentMethodList from '../../components/passenger/PaymentMethodList';
import TicketSummary from '../../components/passenger/TicketSummary';
import { TicketContext } from '../../pages/layout/TicketLayout';


const PassengerPage = () => {
  const { singleForm, travelPassForm } = useContext(TicketContext);
  const [passengers, setPassengers] = useState([]);

  const handlePassengerChange = (updatedPassengers) => {
    setPassengers(updatedPassengers);
  };

  return (
    <Container className="py-4 mt-4">
      <Row>
        {/* Left Section */}
        <Col md={8}>
          <Card className="passenger-form-card mb-4">
            <Card.Header className="bg-white border-0">
              <h4 className="mb-0">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                Passenger Information
              </h4>
              <p className="text-muted small mb-0 mt-2">
                Please provide the email addresses for all passengers. The primary contact will receive the booking confirmation.
              </p>
            </Card.Header>
            <Card.Body>
              <PassengerForm 
                numberOfTickets={singleForm?.numberOfTickets || travelPassForm?.numberOfTickets || 1} 
                onPassengerChange={handlePassengerChange}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Section - Ticket Summary */}
        <Col md={4}>
          <Card className="ticket-summary-card sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-white border-0">
              <h4 className="mb-0">
                <i className="bi bi-receipt me-2 text-primary"></i>
                Booking Summary
              </h4>
            </Card.Header>
            <Card.Body>
              <TicketSummary passengers={passengers} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PassengerPage;
