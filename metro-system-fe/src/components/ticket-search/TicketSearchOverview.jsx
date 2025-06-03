import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const TicketSearchOverview = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([100, 125]);
  const [departureTime, setDepartureTime] = useState([9, 19]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tickets = [
    {
      routes: [
        {
          id: '048A', name: 'North Express',
          legs: [
            {
              depart: '8:30p', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
              arrive: '2:50a', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
            },
            {
              depart: '10:20p', dateDepart: 'Feb 18 THU', from: 'New York', stationFrom: 'Penn Station, NY',
              arrive: '9:50a', dateArrive: 'Feb 19 THU', to: 'Los Angeles', stationTo: 'Union Station, CA'
            }
          ],
          duration: '07:25',
          returnDuration: '11:30'
        }
      ],
      price: 38,
      icons: ['wifi', 'moon', 'cup', 'rocket']
    },
    {
      routes: [
        {
          id: '105A', name: 'Silver Arrow',
          legs: [
            {
              depart: '12:30a', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
              arrive: '3:50p', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
            }
          ],
          duration: '07:25',
          returnDuration: '11:30'
        },
        {
          id: '210B', name: 'Coastal Cruiser',
          legs: [{
            depart: '6:00a', dateDepart: 'Feb 15 MON', from: 'San Francisco', stationFrom: 'SF Central, CA',
            arrive: '12:15p', dateArrive: 'Feb 15 MON', to: 'Los Angeles', stationTo: 'Union Station, CA'
          }
          ],
          duration: '15:49',
          returnDuration: '14:49'

        }
      ],
      price: 45,
      icons: ['wifi', 'cup']
    },
    {
      routes: [
        {
          id: '036C', name: 'American Trains',
          legs: [
            {
              depart: '22:45', dateDepart: 'Feb 14 SUN', from: 'New York', stationFrom: 'Penn Station, NY',
              arrive: '14:34', dateArrive: 'Feb 15 SUN', to: 'Los Angeles', stationTo: 'Union Station, CA'
            }
          ],
          duration: '15:49',
          returnDuration: '11:55'

        }
      ],
      price: 22,
      icons: ['wifi', 'moon', 'cup']
    }

  ];

  const recentTickets = [
    { from: 'New York', to: 'Los Angeles', stationFrom: 'Penn Station, NY', stationTo: 'Union Station, CA', price: 48, active: false },
    { from: 'Paris', to: 'London', stationFrom: 'Gare Saint-Lazare', stationTo: 'Paddington Station', price: 72, active: true },
    { from: 'New York', to: 'Los Angeles', stationFrom: 'Penn Station, NY', stationTo: 'Union Station, CA', price: 36, active: false }
  ];

  const handleDepartureMinChange = (e) => setDepartureTime([Number(e.target.value), departureTime[1]]);
  const handleDepartureMaxChange = (e) => setDepartureTime([departureTime[0], Number(e.target.value)]);
  const handlePriceMinChange = (e) => setPriceRange([Number(e.target.value), priceRange[1]]);
  const handlePriceMaxChange = (e) => setPriceRange([priceRange[0], Number(e.target.value)]);

  const ticketsPerPage = 1;
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIdx = (currentPage - 1) * ticketsPerPage;
  const currentTickets = tickets.slice(startIdx, startIdx + ticketsPerPage);

  return (
    <Container fluid className="bg-light p-3">
      <Row>
        {/* Sidebar Filters + Recent */}
        <Col md={3}>
          <Row className="mb-3 bg-dark text-white p-3">
            <h5 className='mb-3'>Filter by</h5>
            <Form>
              <Form.Group>
                <Form.Label style={{ display: 'flex', justifyContent: 'start' }}>Coach type</Form.Label>
                {['Third class sleeping', 'Second class sleeping', 'First class sleeping', 'Comfortable', 'Third class non reserved', 'Sedentary carriage'].map((type, i) => (
                  <Form.Check type="switch" id={`coach-${i}`} label={type} key={i} />
                ))}
                <Form.Check type="switch" label="All" defaultChecked />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Departure / Arrive time</Form.Label>
                <Form.Control type="range" min={0} max={24} value={departureTime[0]} onChange={handleDepartureMinChange} className="mb-2" />
                <Form.Control type="range" min={0} max={24} value={departureTime[1]} onChange={handleDepartureMaxChange} />
                <div>{`${departureTime[0]}:00 - ${departureTime[1]}:00`}</div>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Price</Form.Label>
                <Form.Control type="range" min={50} max={300} value={priceRange[0]} onChange={handlePriceMinChange} className="mb-2" />
                <Form.Control type="range" min={50} max={300} value={priceRange[1]} onChange={handlePriceMaxChange} />
                <div>{`$${priceRange[0]} - $${priceRange[1]}`}</div>
              </Form.Group>
            </Form>
          </Row>
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
                  <Col md={9}>
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
                                  <div><strong>{leg.depart}</strong></div>
                                  <div className="text-muted small">{leg.dateDepart}</div>
                                  <div className="small">{leg.from}</div>
                                  <div className="small text-muted">{leg.stationFrom}</div>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center small text-muted">
                                  {(i === 0 ? <span><p style={{ fontSize: '30px', margin: '0' }}>→</p> {route.duration}</span> : <span><p style={{ fontSize: '30px', margin: '0' }}>←</p> {route.returnDuration}</span>)}
                                </Col>
                                <Col>
                                  <div><strong>{leg.arrive}</strong></div>
                                  <div className="text-muted small">{leg.dateArrive}</div>
                                  <div className="small">{leg.to}</div>
                                  <div className="small text-muted">{leg.stationTo}</div>
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
                    {(idx === selectedIndex) && <Button variant="danger" onClick={() => navigate('/tickets/passenger')}>Buy Now</Button>}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
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
