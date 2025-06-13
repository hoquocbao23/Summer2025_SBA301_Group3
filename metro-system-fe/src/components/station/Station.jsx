// src/components/Station.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CircleFill } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';

const Station = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/stations")
      .then((res) => {
        if (res.data?.data) setStations(res.data.data);
      })
      .catch((err) => console.error("Failed to load stations:", err));
  }, []);

  return (
    <Container className="py-4">
      <style>
        {`
          .card-img-container {
            position: relative;
          }
          .card-img-container .show-ticket-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .card-img-container:hover .show-ticket-btn {
            opacity: 1;
          }
        `}
      </style>
      <Row className="g-4">
        {stations.map((station) => (
          <Col key={station.stationId} xs={12} md={6} lg={4}>
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/stations/${station.stationId}`)}
            >
              {station.url && (
                <div className="card-img-container">
                  <Card.Img
                    variant="top"
                    src={station.url}
                    alt={station.stationName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className="show-ticket-btn"
                  >
                    Show Tickets
                  </Button>
                  <div className="position-absolute bottom-0 d-flex justify-content-center w-100 mb-2">
                    <div className="d-flex gap-1">
                      <CircleFill size={10} color="white" />
                      <CircleFill size={10} color="rgba(255,255,255,0.5)" />
                      <CircleFill size={10} color="rgba(255,255,255,0.5)" />
                    </div>
                  </div>
                </div>
              )}
              <Card.Body className="p-3">
                <h5 className="mb-1">{station.stationName}</h5>
                <small className="text-muted">{station.stationLocation}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Station;