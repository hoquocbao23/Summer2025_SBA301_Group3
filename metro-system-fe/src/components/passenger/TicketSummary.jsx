import React from 'react';
import { Button } from 'react-bootstrap';

const TicketSummary = () => {
  return (
    <div>
      <h5 className="mb-3">Ticket Summary</h5>
      
      <div className="mb-3">
        <small className="text-muted d-block">From</small>
        <span>Station A</span>
      </div>

      <div className="mb-3">
        <small className="text-muted d-block">To</small>
        <span>Station B</span>
      </div>

      <div className="mb-3">
        <small className="text-muted d-block">Date & Time</small>
        <span>March 15, 2024 - 10:00 AM</span>
      </div>

      <hr className="my-3" />

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Ticket Price</span>
          <span>$20.00</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Service Fee</span>
          <span>$2.00</span>
        </div>
      </div>

      <hr className="my-3" />

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Total</h5>
          <h5>$22.00</h5>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-100"
      >
        Proceed to Payment
      </Button>
    </div>
  );
};

export default TicketSummary; 