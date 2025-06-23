import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import './checkinPage.css';
import  useTicket  from '../../services/ticket';

const CheckinPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
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
        // Reload ticket data after successful API call
        await fetchTicket();
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
      <div className="checkin-card mx-auto">
        <h2 className="mb-4 text-center checkin-title">Check-in Vé</h2>
          <div className="text-center checkin-ticket-info">
            <div className="ticket-id"><strong>Mã vé:</strong> #{ticketId}</div>
             {/* <div className="ticket-status"><strong>Trạng thái:</strong> <span className={`status-badge status-${isCheckIn ? 'true' : 'false'}`}>{isCheckIn ? 'Đã check-in' : 'Đã check-out'}</span></div>  */}
            <div><strong>Ngày mua:</strong> {new Date(ticket.purchaseTime).toLocaleString()}</div> 
            <div><strong>Hành khách:</strong> {ticket.userName}</div>
            <div><strong>Tuyến:</strong> {ticket.routeName}</div>
            <div><strong>Loại vé:</strong> {ticket.ticketName}</div>
          </div>
        {actionError && <Alert variant="danger">{actionError}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <div className="d-flex justify-content-center gap-4 checkin-btn-group">
          <Button 
            className="checkin-btn"
            size="lg"
            variant="success" 
             disabled={actionLoading || ticket.isCheckIn === true}
            onClick={() => handleAction('checkin')}
          >
            {actionLoading ? 'Đang check-in...' : 'Check-in'}
          </Button>
          <Button 
            className="checkin-btn"
            size="lg"
            variant="warning" 
            disabled={actionLoading || ticket.isCheckIn === false}
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