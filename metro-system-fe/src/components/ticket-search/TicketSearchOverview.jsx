import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ToggleButtonGroup, ToggleButton, RangeSlider } from 'react-bootstrap';

const TicketSearchOverview = () => {
  const [priceRange, setPriceRange] = useState([100, 125]);
  const [departureTime, setDepartureTime] = useState([9, 19]);

  return (
    <Container fluid className="bg-light p-3">
      <Row>
        <Col md={3} className="bg-dark text-white p-3">
          <h5>Filter by</h5>
          <Form>
            <Form.Group>
              <Form.Label>Coach type</Form.Label>
              {['Third class sleeping', 'Second class sleeping', 'First class sleeping', 'Comfortable', 'Third class non reserved', 'Sedentary carriage'].map((type, idx) => (
                <Form.Check type="switch" id={`coach-${idx}`} label={type} key={idx} />
              ))}
              <Form.Check type="switch" label="All" defaultChecked />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Departure / Arrive time</Form.Label>
              <RangeSlider
                value={departureTime}
                min={0}
                max={24}
                onChange={e => setDepartureTime([Number(e.target.value), departureTime[1]])}
              />
              <RangeSlider
                value={departureTime}
                min={0}
                max={24}
                onChange={e => setDepartureTime([departureTime[0], Number(e.target.value)])}
              />
              <div>{`${departureTime[0]}:00 - ${departureTime[1]}:00`}</div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Price</Form.Label>
              <RangeSlider
                value={priceRange}
                min={50}
                max={300}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <RangeSlider
                value={priceRange}
                min={50}
                max={300}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
              <div>{`$${priceRange[0]} - $${priceRange[1]}`}</div>
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          {[{
            id: '048A', name: 'North Express', time: '8:30p - 2:50a', date: 'Feb 14 SUN', price: 38, 
            icons: ['wifi', 'moon', 'coffee', 'rocket']
          }, {
            id: '105A', name: 'Silver Arrow', time: '12:30a - 3:50p', date: 'Feb 14 SUN', price: 59,
            icons: ['wifi', 'coffee']
          }, {
            id: '036C', name: 'American Trains', time: '22:45 - 14:34', date: 'Feb 14 SUN', price: 22,
            icons: ['wifi', 'moon', 'coffee']
          }].map((train, idx) => (
            <Card className="mb-3" key={idx}>
              <Card.Body>
                <Row>
                  <Col md={2}>
                    <Card.Title>{train.id}</Card.Title>
                    <Card.Subtitle className="text-muted">{train.name}</Card.Subtitle>
                  </Col>
                  <Col md={6}>
                    <div>{train.time}</div>
                    <div>{train.date}</div>
                  </Col>
                  <Col md={2}>
                    <h4 className="text-danger">${train.price}/person</h4>
                  </Col>
                  <Col md={2}>
                    {train.icons.map((icon, iconIdx) => (
                      <i className={`bi bi-${icon}`} key={iconIdx} style={{ marginRight: '5px' }}></i>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TicketSearchOverview;
