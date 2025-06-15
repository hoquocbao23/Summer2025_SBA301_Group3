import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <div className="error-animation mb-4">
        <FaTimesCircle size={80} color="#dc3545" />
      </div>
      <h2 className="mb-3">Payment Failed</h2>
      <p className="text-muted mb-4">
        We couldn't process your payment. Please check your payment details and try again.
      </p>
      <div className="error-details p-4 bg-light rounded mb-4">
        <h5 className="mb-3">Possible Reasons</h5>
        <ul className="text-start list-unstyled">
          <li className="mb-2">• Insufficient funds in your account</li>
          <li className="mb-2">• Incorrect card details</li>
          <li className="mb-2">• Card expired or blocked</li>
          <li className="mb-2">• Network connectivity issues</li>
        </ul>
      </div>
      <div className="d-flex justify-content-center gap-3">
        <Button 
          variant="outline-danger" 
          onClick={() => navigate(-1)}
        >
          Try Again
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

export default PaymentFailed; 