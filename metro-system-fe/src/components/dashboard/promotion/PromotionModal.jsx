import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

 

const PromotionModal = ({ show, onHide, onSubmit, promotion }) => {

  const [promotionData, setPromotionData] = useState({
    voucher_name: '',
    voucher_code: '',
    voucher_discount: Number,
    from: '',
    to: '',
    status: true
  });

  useEffect(() => {
    if (promotion) {
      // Convert timestamp to date string for input
      
      
      setPromotionData({
        voucher_name: promotion.voucher_name,
        voucher_code: promotion.voucher_code,
        voucher_discount: promotion.voucher_discount,
        from: promotion.from,
        to: promotion.to,
        status: promotion.status
      });
    } else {
      // Reset form when adding new promotion
      setPromotionData({
        voucher_name: '',
        voucher_code: '',
        voucher_discount: '',
        from: '',
        to: '',
        status: true
      });
    }
  }, [promotion]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(promotionData);
    
  };

  

  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{promotion ? 'Edit Promotion' : 'Add New Promotion'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Voucher Name</Form.Label>
            <Form.Control
              type="text"
              name="voucher_name"
              value={promotionData.voucher_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Voucher Code</Form.Label>
            <Form.Control
              type="text"
              name="voucher_code"
              value={promotionData.voucher_code}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              type="number"
              name="voucher_discount"
              value={promotionData.voucher_discount}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              name="from"
              value={promotionData.from}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="to"
              value={promotionData.to}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="status-switch"
              name="status"
              label="Active"
              checked={promotionData.status}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {promotion ? 'Update' : 'Add'} Promotion
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PromotionModal; 