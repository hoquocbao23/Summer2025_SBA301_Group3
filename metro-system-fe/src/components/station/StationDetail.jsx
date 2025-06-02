// src/components/StationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { stations } from '../../data/stationsData'; // Import centralized data

const StationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);

  useEffect(() => {
    const stationData = stations.find((s) => s.id === parseInt(id));
    setStation(stationData);
  }, [id]);

  if (!station) {
    return (
      <Container className="py-4">
        <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
          Back to Stations
        </Button>
        <h3>Station Not Found</h3>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
        Back to Stations
      </Button>
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <div style={{ position: "relative" }}>
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
              />
            </div>
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
              <p>{station.description}</p>
              <h5>Route Map</h5>
              <div
                style={{
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                }}
              >
                [Map Placeholder]
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationDetail;