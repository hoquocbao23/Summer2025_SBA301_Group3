import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const updateTicketStatus = async () => {
      try {
        const paymentData = JSON.parse(localStorage.getItem('paymentData'));
        localStorage.removeItem('paymentData');
        const failed = searchParams.get('cancel');
        
        if (failed && paymentData?.ticketId) {
          setTicketId(paymentData.ticketId);
          // Call API to update ticket status
          await axiosInstance.put(`tickets/failed/${paymentData.ticketId}`, {
            userEmails: paymentData.userEmails
          });
          // Clear payment data after successful update
          
        }
      } catch (error) {
        console.error('Error updating ticket status:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    updateTicketStatus();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Processing your payment status...</p>
      </Container>
    );
  }

  return (
    <Container className="text-center py-5">
      <div className="failed-animation mb-4">
        <FaTimesCircle size={80} color="#dc3545" />
      </div>
      <h2 className="mb-3">Payment Failed</h2>
      <p className="text-muted mb-4">
        Your payment was not successful. Please try again or contact support if the problem persists.
      </p>
      <div className="ticket-details p-4 bg-light rounded mb-4">
        <h5 className="mb-3">Ticket Details</h5>
        <div className="row text-start">
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Ticket ID</small>
            <span className="fw-bold">#{ticketId || 'N/A'}</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Status</small>
            <span className="text-danger">Failed</span>
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

export default PaymentFailed; 