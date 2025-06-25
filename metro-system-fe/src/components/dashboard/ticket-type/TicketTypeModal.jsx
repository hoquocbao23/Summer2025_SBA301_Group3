import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const TicketTypeModal = ({ show, onHide, onSubmit, ticketType }) => {
  const [ticketTypeData, setTicketTypeData] = useState({
    ticketName: '',
    validityDays: '',
    description: '',
    usageLimit: false,
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (ticketType) {
      console.log("ticketType", ticketType);
      setTicketTypeData({
        
        ticketName: ticketType.ticketName ,
        validityDays: ticketType.validityDays ,
        description: ticketType.description ,
        usageLimit: ticketType.usageLimit || false,
        status: ticketType.status || 'ACTIVE'
      });
    } else {
      console.log("ticketTypenull", ticketType);
      setTicketTypeData({
        ticketName: '',
        validityDays: '',
        description: '',
        usageLimit: false,
        status: 'ACTIVE'
      });
    }
  }, [ticketType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicketTypeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? 
        (name === 'status' ? (checked ? 'ACTIVE' : 'INACTIVE') : checked) 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ticketTypeData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{ticketType ? 'Edit Ticket Type' : 'Add New Ticket Type'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ticket Type Name</Form.Label>
            <Form.Control
              type="text"
              name="ticketName"
              value={ticketTypeData.ticketName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Validity Days</Form.Label>
            <Form.Control
              type="number"
              name="validityDays"
              value={ticketTypeData.validityDays}
              onChange={handleInputChange}
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={ticketTypeData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="usage-limit-switch"
              name="usageLimit"
              label="Limited Usage"
              checked={ticketTypeData.usageLimit}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="status-switch"
              name="status"
              label="Active"
              checked={ticketTypeData.status === 'ACTIVE'}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {ticketType ? 'Update' : 'Add'} Ticket Type
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TicketTypeModal; 