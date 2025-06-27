import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PassengerForm from '../../components/passenger/PassengerForm';
// import PaymentMethodList from '../../components/passenger/PaymentMethodList';
import TicketSummary from '../../components/passenger/TicketSummary';
import { TicketContext } from '../../pages/layout/TicketLayout';
import PromotionInput from '../../components/promotion/PromotionInput';



const PassengerPage = ({ layoutCurrentStep, onStepChange }) => {
  const { singleForm, travelPassForm } = useContext(TicketContext);
  const [passengers, setPassengers] = useState([]);
  const [currentPassengerStep, setCurrentPassengerStep] = useState(1);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionCode, setPromotionCode] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Get user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handlePromotionApplied = (promotion) => {
    setAppliedPromotion(promotion);
  };

  const handlePromotionCodeChange = (code) => {
    setPromotionCode(code);
  };

  const renderStep = () => {
    switch (currentPassengerStep) {
      case 1:
        return <PassengerForm 
          numberOfTickets={singleForm?.numberOfTickets || travelPassForm?.numberOfTickets || 1}
          onPassengerChange={handlePassengerChange}
          userEmail={userEmail}
        />;
      case 2:
        return <PromotionInput
          ticketType={singleForm?.ticketTypeId || travelPassForm?.ticketTypeId}
          onPromotionApplied={handlePromotionApplied}
          promotionCode={promotionCode}
          onPromotionCodeChange={handlePromotionCodeChange}
        />;
    }
  };

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
              {renderStep()}
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
              <TicketSummary passengers={passengers}
                onNextStep={setCurrentPassengerStep}
                currentPassengerStep={currentPassengerStep}
                layoutCurrentStep={layoutCurrentStep}
                onStepChange={onStepChange}
                promotion={appliedPromotion}
              />

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PassengerPage;
