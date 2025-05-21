import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Nav,
  Pagination,
  Badge
} from 'react-bootstrap';
import { TrainFront, PeopleFill, CreditCard, CheckCircle } from 'react-bootstrap-icons';

const TicketSearchOverview = () => {
  // Mock data
  const tickets = [
    {
      trainNumber: '045A',
      departureTime: '8:30 AM',
      departureStation: 'New York',
      ArrivalTime: '10:20 AM',
      arrivalStation: 'Washington, D.C.',
      duration: '1h 50m',
      price: 38,
      coachType: 'Sleeper'
    },
    {
      trainNumber: '105A',
      departureTime: '12:30 PM',
      departureStation: 'Chicago',
      ArrivalTime: '3:50 PM',
      arrivalStation: 'St. Louis',
      duration: '3h 20m',
      price: 59,
      coachType: 'AC'
    },
    {
      trainNumber: '036C',
      departureTime: '10:20 PM',
      departureStation: 'Los Angeles',
      ArrivalTime: '2:15 AM',
      arrivalStation: 'San Diego',
      duration: '3h 55m',
      price: 22,
      coachType: 'Seater'
    }
  ];

  const recentTickets = tickets.slice(0, 2);
  const recentPosts = [
    { title: 'Coming soon: summer discount', img: '/img/post1.jpg' },
    { title: 'New high-speed route', img: '/img/post2.jpg' }
  ];

  return (
    <Container fluid className="py-4">
      <Nav variant="tabs" defaultActiveKey="tickets" className="mb-4">
        <Nav.Item><Nav.Link active><TrainFront /> Tickets</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link><PeopleFill /> Passengers</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link><CreditCard /> Payment</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link><CheckCircle /> Validation</Nav.Link></Nav.Item>
      </Nav>

      <Row>
        {/* Filter Sidebar static */}
        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Filter by</Card.Title>
              <Form.Group className="mb-3">
                <Form.Label>Coach type</Form.Label>
                {['Sleeper', 'Seater', 'AC'].map(type => (
                  <Form.Check key={type} type="checkbox" label={type} checked />
                ))}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Departure before: 12:00</Form.Label>
                <Form.Range value={12} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Label>Max Price: $100</Form.Label>
                <Form.Range value={100} readOnly />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Ticket List static */}
        <Col md={6}>
          {tickets.map((r, idx) => (
            <Card className="mb-3" key={idx}>
              <Card.Body>
                <Row>
                  <Col md={2} className="d-flex align-items-center">
                    <strong>{r.trainNumber}</strong>
                  </Col>
                  <Col md={7}>
                    <Row>
                      <Col>
                        <div><small className="text-muted">{r.departureTime}</small></div>
                        <div>{r.departureStation}</div>
                      </Col>
                      <Col className="text-center">
                        <div><small className="text-muted">Duration</small></div>
                        <div>{r.duration}</div>
                      </Col>
                      <Col>
                        <div><small className="text-muted">{r.ArrivalTime}</small></div>
                        <div>{r.arrivalStation}</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={3} className="text-end">
                    <div><h5>${r.price}</h5></div>
                    <Button variant="primary">Select</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          <Pagination>
            <Pagination.Prev disabled />
            <Pagination.Item active>1</Pagination.Item>
            <Pagination.Item>2</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </Col>

        {/* Recent Tickets & Posts */}
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Recent Tickets</Card.Title>
              {recentTickets.map((r,i) => (
                <div key={i} className="d-flex justify-content-between mb-2">
                  <span>{r.trainNumber} ({r.departureStation} - {r.arrivalStation})</span>
                  <Badge bg="danger">${r.price}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Recent Posts</Card.Title>
              {recentPosts.map((p,i) => (
                <Card key={i} className="mb-2">
                  <Row className="g-0">
                    <Col md={4}>
                      <Card.Img src={p.img} alt={p.title}/>
                    </Col>
                    <Col md={8}>
                      <Card.Body className="p-2">
                        <Card.Text>{p.title}</Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TicketSearchOverview;
