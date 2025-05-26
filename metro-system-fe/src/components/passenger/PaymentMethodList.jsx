import React from 'react';
import { Form } from 'react-bootstrap';
import { FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';

const PaymentMethodList = () => {
  return (
    <div>
      <h5 className="mb-3">Payment Method</h5>
      <Form>
        <Form.Check
          type="radio"
          id="credit-card"
          name="payment-method"
          label={
            <div className="d-flex align-items-center">
              <FaCreditCard className="me-2" />
              <span>Credit Card</span>
            </div>
          }
          defaultChecked
          className="mb-3"
        />
        <hr className="my-2" />
        <Form.Check
          type="radio"
          id="paypal"
          name="payment-method"
          label={
            <div className="d-flex align-items-center">
              <FaPaypal className="me-2" />
              <span>PayPal</span>
            </div>
          }
          className="mb-3"
        />
        <hr className="my-2" />
        <Form.Check
          type="radio"
          id="cash"
          name="payment-method"
          label={
            <div className="d-flex align-items-center">
              <FaMoneyBillWave className="me-2" />
              <span>Cash at Station</span>
            </div>
          }
          className="mb-3"
        />
      </Form>
    </div>
  );
};

export default PaymentMethodList; 