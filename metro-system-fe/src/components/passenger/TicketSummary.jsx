import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import axiosInstance from '../../config/axios';
import { TicketContext } from '../../pages/layout/TicketLayout';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const TicketSummary = ({ passengers = [] }) => {
  const navigate = useNavigate();

  const { singleForm, travelPassForm } = useContext(TicketContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [ticket, setTicket] = useState(
    {
      departureStation: singleForm?.fromStationId,
      arrivalStation: singleForm?.toStationId,
      routeId: travelPassForm?.routeId,
      ticketName: travelPassForm?.ticketName,
      ticketTypeId: travelPassForm?.ticketTypeId,
      numberOfPassengers: singleForm?.numberOfTickets || travelPassForm?.numberOfTickets || 1,
      salePrice: 10000,
      total: travelPassForm?.basePrice || 20000,
    }
  );
  const [voucherCode, setVoucherCode] = useState('');

  const handleApplyVoucher = () => {
    // Handle voucher application logic here
    console.log('Applying voucher:', voucherCode);
  };

  const handleProceedToPayment = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    try {
      console.log("ticketdto", ticket);
      const response = await axiosInstance.post('/tickets/unlimit', ticket);
      const paymentUrl = response.data.data;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const renderTicketDetails = () => {
    if (singleForm) {
      return (
        <>
          <div className="mb-2">
            <small className="text-muted">From:</small>
            <p className="mb-0">{singleForm.fromStation}</p>
          </div>
          <div className="mb-2">
            <small className="text-muted">To:</small>
            <p className="mb-0">{singleForm.toStation}</p>
          </div>
          <div className="mb-2">
            <small className="text-muted">Passenger Emails:</small>
            {passengers.map((passenger, index) => (
              <p key={index} className="mb-0">
                {index === 0 ? 'Primary: ' : `Passenger ${index + 1}: `}
                {passenger.email}
              </p>
            ))}
          </div>
        </>
      );
    }
    if (travelPassForm) {
      return (
        <>
          <div className="mb-2">
            <small className="text-muted">Pass Type:</small>
            <p className="mb-0">{travelPassForm.ticketName}</p>
          </div>
          <div className="mb-2">
            <small className="text-muted">Route:</small>
            <p className="mb-0">{travelPassForm.routeName}</p>
          </div>
          <div className="mb-2">
            <small className="text-muted">Passenger Emails:</small>
            {passengers.map((passenger, index) => (
              <p key={index} className="mb-0">
                {index === 0 ? 'Primary: ' : `Passenger ${index + 1}: `}
                {passenger.email}
              </p>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <h5 className="mb-3">Ticket Summary</h5>
      {singleForm && (
        <div>
          <div className="mb-3">
            <small className="text-muted d-block">From</small>
            <span className="fw-bold">{singleForm.fromStation}</span>
          </div>

          <div className="mb-3">
            <small className="text-muted d-block">To</small>
            <span className="fw-bold">{singleForm.toStation}</span>
          </div>
        </div>
      )}

      {travelPassForm && (
        <div>
          <div className="mb-3">
            <small className="text-muted d-block">Pass Type</small>
            <span className="fw-bold">{travelPassForm.ticketName}</span>
          </div>
          <div className="mb-3">
            <small className="text-muted d-block">Route</small>
            <span className="fw-bold">{travelPassForm.routeName}</span>
          </div>
        </div>  
      )}

      <div className="mb-3">
        <small className="text-muted d-block">Date</small>
        <span>{new Date().toLocaleDateString('vi-VN')}</span>
      </div>

      <hr className="my-3" />

      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Ticket Price</span>
          <span>{formatCurrency(travelPassForm?.basePrice || 20000)}</span>
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
          <span>{formatCurrency(travelPassForm?.basePrice || 20000)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Promotion</span>
          <span>{formatCurrency(ticket.salePrice)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          <h5>Payment</h5>
          <h5>{formatCurrency(travelPassForm?.basePrice - ticket.salePrice)}</h5>
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

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3 bg-light rounded mb-3">
            {renderTicketDetails()}
            <div className="mb-2">
              <small className="text-muted">Date:</small>
              <p className="mb-0">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="mb-2">
              <small className="text-muted">Number of Passengers:</small>
              <p className="mb-0">{ticket.numberOfPassengers}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Total Amount:</span>
              <span className="fw-bold">{formatCurrency(ticket.total - ticket.salePrice)}</span>
            </div>
          </div>
          <p className="text-muted mb-0">Please confirm the details above before proceeding to payment.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPayment}>
            Confirm & Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TicketSummary; 