// src/components/StationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axiosInstance from '../../config/axios';

const StationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/stations/${id}`)
      .then((res) => {
        if (res.data?.data) setStation(res.data.data);
      })
      .catch((err) => console.error("Failed to load station detail:", err));
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
        <Col xs={12} md={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Img
              variant="top"
              src={station.url}
              alt={station.stationName}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <h3 className="mb-2">{station.stationName}</h3>
              <p className="text-muted mb-3">{station.stationLocation}</p>
              <Badge bg={station.status === 'ACTIVE' ? 'success' : 'secondary'} className="mb-2">
                {station.status}
              </Badge>
              <hr />
              <h5 className="mt-3">Description</h5>
              <p>{station.description}</p>
              {/* You can add more details here if available */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationDetail;