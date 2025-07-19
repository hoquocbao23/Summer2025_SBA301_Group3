import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { useState, useEffect } from 'react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingId, setBookingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const updateTicketStatus = async () => {
      try {
        const paymentData = JSON.parse(localStorage.getItem('paymentData'));
        localStorage.removeItem('paymentData');
        console.log("paymentData", paymentData);
        const success = searchParams.get('status');
        console.log("success", success);

        if (success === 'PAID' && paymentData?.bookingId) {
          setBookingId(paymentData.bookingId);
          // Call API to update ticket status
          await axiosInstance.put(`tickets/success/${paymentData.bookingId}`, paymentData);
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
      <div className="success-animation mb-4">
        <FaCheckCircle size={80} color="#28a745" />
      </div>
      <h2 className="mb-3">Thanh toán thành công!</h2>
      <p className="text-muted mb-4">
        Vé của bạn đã được mua thành công. Bạn có thể tìm thông tin vé trong email của mình.
      </p>
      <div className="ticket-details p-4 bg-light rounded mb-4">
        <h5 className="mb-3">Chi tiết vé</h5>
        <div className="row text-start">
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Mã đặt vé</small>
            <span className="fw-bold">#{bookingId || 'N/A'}</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Ngày đặt vé</small>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Trạng thái</small>
            <span className="text-success">Đã thanh toán</span>
          </div>
          <div className="col-md-6 mb-3">
            <small className="text-muted d-block">Phương thức thanh toán</small>
            <span>PayOS</span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center gap-3">
        <Button
          variant="outline-primary"
          onClick={() => navigate('/bookings')}
        >
          Xem vé của tôi
        </Button>
        <Button
          onClick={() => navigate('/')}
        >
          Quay về trang chủ
        </Button>
      </div>
    </Container>
  );
};

export default PaymentSuccess; 