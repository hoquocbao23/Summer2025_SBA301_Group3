import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import './checkinPage.css';

const CheckinPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (ticketId) {
        // Fake data mẫu
        setTicket({
          id: ticketId,
          status: 'Chưa check-in',
          purchaseDate: new Date().toISOString(),
          passengerName: 'Nguyễn Văn A',
          route: 'Ga A - Ga B',
          seat: '12A',
          paymentMethod: 'Credit Card',
        });
      } else {
        setError('Không tìm thấy mã vé.');
      }
      setLoading(false);
    }, 600);
  }, [ticketId]);

  const handleAction = async (type) => {
    setActionLoading(true);
    setActionError(null);
    setSuccessMsg(null);
    setTimeout(() => {
      if (!ticket) {
        setActionError('Không có thông tin vé.');
        setActionLoading(false);
        return;
      }
      if (type === 'checkin') {
        setTicket({ ...ticket, status: 'Checked-in' });
        setSuccessMsg('Check-in thành công!');
      } else {
        setTicket({ ...ticket, status: 'Checked-out' });
        setSuccessMsg('Check-out thành công!');
      }
      setActionLoading(false);
    }, 600);
  };

  if (loading) {
    return (
      <Container className="text-center py-5 checkin-container">
        <Spinner animation="border" />
        <p>Đang tải thông tin vé...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 checkin-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 checkin-container">
      <div className="checkin-card mx-auto">
        <h2 className="mb-4 text-center checkin-title">Check-in Vé</h2>
        <div className="d-flex flex-column align-items-center mb-4 checkin-qr-block">
          <div className="checkin-qr-wrapper mb-3">
            <QRCodeSVG value={ticketId} size={200} bgColor="#fff" fgColor="#1e88e5" />
          </div>
          <div className="text-center checkin-ticket-info">
            <div className="ticket-id"><strong>Mã vé:</strong> #{ticketId}</div>
            <div className="ticket-status"><strong>Trạng thái:</strong> <span className={`status-badge status-${ticket.status.replace(/\s/g, '').toLowerCase()}`}>{ticket.status}</span></div>
            <div><strong>Ngày mua:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</div>
            <div><strong>Hành khách:</strong> {ticket.passengerName}</div>
            <div><strong>Tuyến:</strong> {ticket.route}</div>
            <div><strong>Chỗ ngồi:</strong> {ticket.seat}</div>
            <div><strong>Thanh toán:</strong> {ticket.paymentMethod}</div>
          </div>
        </div>
        {actionError && <Alert variant="danger">{actionError}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <div className="d-flex justify-content-center gap-4 checkin-btn-group">
          <Button
            className="checkin-btn"
            size="lg"
            variant="success"
            disabled={actionLoading || ticket.status === 'Checked-in'}
            onClick={() => handleAction('checkin')}
          >
            {actionLoading ? 'Đang check-in...' : 'Check-in'}
          </Button>
          <Button
            className="checkin-btn"
            size="lg"
            variant="warning"
            disabled={actionLoading || ticket.status !== 'Checked-in'}
            onClick={() => handleAction('checkout')}
          >
            {actionLoading ? 'Đang check-out...' : 'Check-out'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CheckinPage; 