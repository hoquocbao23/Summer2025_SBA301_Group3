import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { tickets } from '../../data/tickets';
import { useLocation } from 'react-router-dom';
import { TicketContext } from '../../pages/layout/TicketLayout';

const TicketSearchOverview = ({ onStepChange }) => {

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBuyNow = () => {
    onStepChange(2);
  }

  const { singleForm} = useContext(TicketContext);
  

  const recentTickets = [
    { from: 'New York', to: 'Los Angeles', stationFrom: 'Penn Station, NY', stationTo: 'Union Station, CA', price: 48, active: false },
    { from: 'Paris', to: 'London', stationFrom: 'Gare Saint-Lazare', stationTo: 'Paddington Station', price: 72, active: true },
    { from: 'New York', to: 'Los Angeles', stationFrom: 'Penn Station, NY', stationTo: 'Union Station, CA', price: 36, active: false }
  ];


  const ticketsPerPage = 1;
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIdx = (currentPage - 1) * ticketsPerPage;
  const currentTickets = tickets.slice(startIdx, startIdx + ticketsPerPage);

  return (
    <Container fluid className="bg-light p-3">
      <Row>
        {/* Sidebar Filters + Recent */}
        <Col md={3}>
          <hr className="border-light my-4" />
          <Row className="mb-3">

            <h5 className='mb-3'>Recent Tickets</h5>
            {recentTickets.map((t, idx) => (
              <Card key={idx} className={`mb-2 ${t.active ? 'border border-danger' : ''}`}>
                <Card.Body className="p-2">
                  <div className="d-flex justify-content-between small fw-semibold">
                    <span>{t.from}</span><span>{t.to}</span>
                  </div>
                  <div className="text-muted small d-flex justify-content-between">
                    <span>{t.stationFrom}</span><span>{t.stationTo}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="text-muted small">
                      <i className="bi bi-wifi me-2"></i>
                      <i className="bi bi-moon me-2"></i>
                      <i className="bi bi-cup"></i>
                    </div>
                    <span className="text-danger fw-bold small">from ${t.price}</span>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Col>

        {/* Ticket Results */}
        <Col md={9} className="p-3">
          <Row className="mb-3 align-items-center">
            <Col className="text-start">{`${selectedIndex !== null ? selectedIndex + 1 : ''} of ${tickets.length} found`}</Col>
            <Col className="text-end">Sort by <a href="#">time</a> | Show <a href="#">5 tickets</a></Col>
          </Row>
          {tickets.map((ticket, idx) => (
            <Card
              key={ticket.routes[0].id}
              onClick={() => setSelectedIndex(idx)}
              className={`mb-3 ${(idx === selectedIndex) ? 'border border-danger' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Row>
                  <Col md={9} className="d-flex flex-column justify-content-center">
                    {ticket.routes.map((route, routeIdx) => (
                      <>
                        {routeIdx > 0 ? <hr /> : null}
                        <Row key={routeIdx}>
                          <Col md={3} className="text-center">
                            <div style={{ fontSize: '2rem' }}><i className="bi bi-train-front-fill"></i></div>
                            <Card.Title>{route.id}</Card.Title>
                            <Card.Subtitle className="text-muted">{route.name}</Card.Subtitle>
                          </Col>
                          <Col md={9}>
                            {route.legs.map((leg, i) => (
                              <Row key={i} className="mb-2">
                                <Col>
                                  <div className=" text-muted fw-bold  ">{leg.stationFrom}</div>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center small text-muted">
                                  {(i === 0 ? <span><p style={{ fontSize: '30px', margin: '0' }}>→</p> {route.duration}</span> : <span><p style={{ fontSize: '30px', margin: '0' }}>←</p> {route.returnDuration}</span>)}
                                </Col>
                                <Col>
                                  
                                  
                                  <div className=" text-muted fw-bold">{leg.stationTo}</div>
                                </Col>
                              </Row>
                            ))}
                          </Col>
                        </Row>
                      </>
                    ))}
                  </Col>
                  <Col md={3} style={{ borderLeft: "1px solid #b3acac" }} className="d-flex flex-column align-items-center justify-content-center">
                    <h3 className="text-danger mb-2">${ticket.price}/person</h3>
                    <div className="mb-2 small">
                      {ticket.icons.map((icon, i) => <i key={i} className={`bi bi-${icon} me-2`}></i>)}
                    </div>
                    {(idx === selectedIndex) && (
                      <Button 
                        variant="danger" 
                          onClick={() => handleBuyNow()}
                      >
                        Buy Now
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Button variant="outline-secondary mx-2" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>&lt;</Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'danger' : 'outline-secondary'}
                className="mx-2"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline-secondary mx-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>&gt;</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TicketSearchOverview;
