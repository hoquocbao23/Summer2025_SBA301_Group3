import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const StationDetail = () => {
  const navigate = useNavigate();
  const [station, setStation] = useState(null);

  useEffect(() => {
    // Mock API call
    const mockApiData = {
      id: 1,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Ben Thanh",
      toStation: "Ba Son",
      frequency: "Every day",
      price: "$238",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
      overlay: "rgba(255, 69, 0, 0.6)", // Added overlay for consistency
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      setStation(mockApiData);
    }, 500);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (!station) {
    return (
      <Container className="py-4">
        <h3>Loading...</h3>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
        Back to Stations
      </Button>
      <Row className="g-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              variant="top"
              src={station.image}
              alt={`${station.fromStation} to ${station.toStation}`}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '300px',
                background: station.overlay,
              }}
            ></div>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">
                  {station.fromStation} to {station.toStation}
                </h3>
                <Badge bg="success">{station.frequency}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">{station.fromCity}</span>
                <div className="text-end">
                  <small className="text-muted me-1">From</small>
                  <span className="text-danger fw-bold">{station.price}</span>
                </div>
              </div>
              <hr />
              <h5>Route Description</h5>
              <p>
                The route from {station.fromStation} to {station.toStation} is part of Ho Chi Minh City's Metro Line 1. 
                This line connects key areas of the city, providing a convenient and efficient mode of transportation. 
                The journey offers scenic views of the city and passes through bustling districts.
              </p>
              <h5>Route Map</h5>
              <div
                style={{
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '5px',
                }}
              >
                <span className="text-muted">Route Map Placeholder</span>
              </div>
              <div className="mt-4 text-center">
                <Button variant="primary" size="lg">
                  Buy Tickets
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationDetail;