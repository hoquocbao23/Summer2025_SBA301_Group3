import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import axiosInstance from '../../config/axios';
import { TicketContext } from '../../pages/layout/TicketLayout';

const TicketSummary = () => {


  const { singleForm, travelPassForm } = useContext(TicketContext);

  const [ticket, setTicket] = useState(
    {
      from: singleForm?.fromStation,
      to: singleForm?.toStation,
      routeName: travelPassForm?.routeName,
      ticketName: travelPassForm?.ticketName,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      price: 20.00,
      numberOfPassengers: singleForm?.numberOfTickets || travelPassForm?.numberOfTickets || 1,
      salePrice: 10.00,
      total: 22.00,
    }
  );
  const [voucherCode, setVoucherCode] = useState('');

  const handleApplyVoucher = () => {
    // Handle voucher application logic here
    console.log('Applying voucher:', voucherCode);
  };

  const handleProceedToPayment = () => {
    alert('Proceeding to payment');
  };

  return (
    <div>
      <h5 className="mb-3">Ticket Summary</h5>
      {singleForm && (
        <div>
          <div className="mb-3">
            <small className="text-muted d-block">From</small>
            <span className="fw-bold">{ticket.from}</span>
          </div>

          <div className="mb-3">
            <small className="text-muted d-block">To</small>
            <span className="fw-bold">{ticket.to}</span>
          </div>
        </div>
      )}

      {travelPassForm && (
        <div>
          <div className="mb-3">
            <small className="text-muted d-block">Pass Type</small>
            <span className="fw-bold">{ticket.ticketName}</span>
          </div>
          <div className="mb-3">
            <small className="text-muted d-block">Route</small>
            <span className="fw-bold">{ticket.routeName}</span>
          </div>
        </div>  
      )}

      <div className="mb-3">
        <small className="text-muted d-block">Date</small>
        <span>{ticket.date}</span>
      </div>

      <hr className="my-3" />

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Ticket Price</span>
          <span>${ticket.price}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Number of Passengers</span>
          <span>{ticket.numberOfPassengers}</span>
        </div>
      </div>

      <div className="mb-3">
        <Form.Label>Voucher Code</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Enter voucher code"
          />
          <Button variant="outline-primary" onClick={handleApplyVoucher}>
            Apply
          </Button>
        </InputGroup>
      </div>

      <hr className="my-3" />
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Total</span>
          <span>${ticket.total}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Promotion</span>
          <span>{ticket.salePrice}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Payment</h5>
          <h5>${ticket.total - ticket.salePrice}</h5>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-100"
        onClick={handleProceedToPayment}
      >
        Proceed to Payment
      </Button>
    </div>
  );
};

export default TicketSummary; 