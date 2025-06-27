import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import './checkinPage.css';
import useTicket from '../../services/ticket';
import HistoryTable from './HistoryTable';

const CheckinPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { getTicketById, checkInTicket, checkOutTicket } = useTicket();


  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (ticketId) {
        fetchTicket();
      } else {
        setError('Không tìm thấy mã vé.');
      }
      setLoading(false);
    }, 600);
  }, []);

  const fetchTicket = async () => {
    const ticket = await getTicketById(ticketId);
    console.log(ticket);
    setTicket(ticket);
  };

  const handleAction = async (type) => {
    setActionLoading(true);
    setActionError(null);
    setSuccessMsg(null);
    setTimeout(async () => {
      if (!ticket) {
        setActionError('Không có thông tin vé.');
        setActionLoading(false);
        return;
      }
      try {
        if (type === 'checkin') {
          const response = await checkInTicket(+ticketId);
          console.log(response);
          setSuccessMsg('Check-in thành công!');
        } else {
          const response = await checkOutTicket(+ticketId);
          console.log(response);
          setSuccessMsg('Check-out thành công!');
        }
        // Reload ticket data and trigger history reload
        await fetchTicket();
        setReloadTrigger(prev => prev + 1);

      } catch (error) {
        setActionError('Có lỗi xảy ra khi thực hiện thao tác.');
        console.error('Error:', error);
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
      <Row className="g-4 checkin-row-equal align-items-start">
        {/* Left Column - Check-in Card */}
        <Col lg={5} md={12}>
          <div className="checkin-card">
            <h2 className="mb-4 text-center checkin-title">Check-in Vé</h2>
            <div className="text-center checkin-ticket-info">
              <div className="ticket-id"><strong>Mã vé:</strong> #{ticketId}</div>
              <div className="ticket-status">
                <strong>Trạng thái:</strong> 
                <span className={`status-badge status-${ticket.ticketStatus === "EXPIRED" ? 'expired' : ticket.ticketStatus === "CANCELLED" ? 'cancelled' : (ticket.isCheckIn ? 'checked-in' : 'available')}`}>
                  {ticket.ticketStatus === "EXPIRED" ? 'Hết hạn' : ticket.ticketStatus === "CANCELLED" ? 'Đã hủy' : (ticket.isCheckIn ? 'Đã check-in' : 'Chưa check-in')}
                </span>
              </div>
              <div><strong>Ngày mua:</strong> {new Date(ticket.purchaseTime).toLocaleString()}</div>
              <div><strong>Hành khách:</strong> {ticket.userName}</div>
              <div><strong>Tuyến:</strong> {ticket.routeName}</div>
              <div><strong>Loại vé:</strong> {ticket.ticketName}</div>
            </div>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            <div className="d-flex justify-content-center gap-4 checkin-btn-group">

              {/* Kiểm tra vé hết hạn hoặc đã hủy trước tiên */}
              {(ticket.ticketStatus === "EXPIRED" || ticket.ticketStatus === "CANCELLED") && (
                <Button
                  className="checkin-btn"
                  size="lg"
                  variant="danger"
                  disabled={true}
                >
                  {ticket.ticketStatus === "EXPIRED" ? 'Vé đã hết hạn' : 'Vé đã hủy'}
                </Button>
              )}

              {/* Chỉ hiển thị các nút khác khi vé chưa hết hạn và chưa hủy */}
              {ticket.ticketStatus !== "EXPIRED" && ticket.ticketStatus !== "CANCELLED" && (
                <>
                  {ticket.isCheckIn === false && (
                    <Button
                      className="checkin-btn"
                      size="lg"
                      variant="success"
                      onClick={() => handleAction('checkin')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang check-in...
                        </>
                      ) : 'Check-in'}
                    </Button>
                  )}

                  {ticket.isCheckIn === true && (
                    <Button
                      className="checkin-btn"
                      size="lg"
                      variant="warning"
                      onClick={() => handleAction('checkout')}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang check-out...
                        </>
                      ) : 'Check-out'}
                    </Button>
                  )}
                </>
              )}
              
            </div>
          </div>
        </Col>

        {/* Right Column - History Table */}
        <Col lg={7} md={12}>
          <HistoryTable ticketId={ticketId} reloadTrigger={reloadTrigger} />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckinPage; 