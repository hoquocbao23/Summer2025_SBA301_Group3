import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

 

const PromotionModal = ({ show, onHide, onSubmit, promotion }) => {

  const [promotionData, setPromotionData] = useState({
    promotionName: '',
    promotionCode: '',
    promotionDiscount: Number,
    fromDate: '',
    toDate: '',
    status: true
  });

  useEffect(() => {
    if (promotion) {
      // Convert timestamp to date string for input
      setPromotionData({
        promotionName: promotion.promotionName,
        promotionCode: promotion.promotionCode,
        promotionDiscount: promotion.promotionDiscount,
        fromDate: promotion.fromDate,
        toDate: promotion.toDate,
        status: promotion.status
      });
    } else {
      // Reset form when adding new promotion
      setPromotionData({
        promotionName: '',
        promotionCode: '',
        promotionDiscount: '',
        fromDate: '',
        toDate: '',
        status: true
      });
    }
  }, [promotion]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'ACTIVE' : 'INACTIVE') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format dates to ISO format with UTC timezone
    const formattedData = {
      ...promotionData,
      fromDate: promotionData.fromDate ? new Date(promotionData.fromDate + ' 00:00:00').toISOString() : null,
      toDate: promotionData.toDate ? new Date(promotionData.toDate + ' 23:59:59').toISOString() : null
    };
    onSubmit(formattedData);
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
              name="promotionName"
              value={promotionData.promotionName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Voucher Code</Form.Label>
            <Form.Control
              type="text"
              name="promotionCode"
              value={promotionData.promotionCode}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              type="number"
              name="promotionDiscount"
              value={promotionData.promotionDiscount}
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
              name="fromDate"
              value={promotionData.fromDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              name="toDate"
              value={promotionData.toDate}
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
              checked={promotionData.status === 'ACTIVE'}
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