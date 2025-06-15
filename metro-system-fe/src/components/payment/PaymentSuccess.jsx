import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <div className="success-animation mb-4">
        <FaCheckCircle size={80} color="#28a745" />
      </div>
      <h2 className="mb-3">Payment Successful!</h2>
      <p className="text-muted mb-4">
        Your ticket has been successfully purchased. You can find your ticket details in your email.
      </p>
      <div className="ticket-details p-4 bg-light rounded mb-4">
        <h5 className="mb-3">Ticket Details</h5>
        <div className="row text-start">
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Ticket ID</small>
            <span className="fw-bold">#TK-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Purchase Date</small>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Status</small>
            <span className="text-success">Confirmed</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Payment Method</small>
            <span>Credit Card</span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center gap-3">
        <Button 
          variant="outline-primary" 
          onClick={() => navigate('/tickets')}
        >
          View My Tickets
        </Button>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default PaymentSuccess; 