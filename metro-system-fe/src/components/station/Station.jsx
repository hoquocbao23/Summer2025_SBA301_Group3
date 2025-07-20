// src/components/Station.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
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
              {station.imageUrl && (
                <div className="card-img-container">
                  <Card.Img
                    variant="top"
                    src={station.imageUrl}
                    alt={station.stationName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className="show-ticket-btn"
                  >
                    Xem chi tiết
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
              {!station.imageUrl && (
                <div className="card-img-container bg-light d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                  <div className="text-center text-muted">
                    <div style={{ fontSize: "3rem" }}>🖼️</div>
                    <div className="mt-2">Không có hình ảnh</div>
                  </div>
                </div>
              )}
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="mb-0">{station.stationName || 'Chưa có tên ga'}</h5>
                  <Badge bg={station.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {station.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </Badge>
                </div>
                <small className="text-muted">{station.stationLocation || 'Chưa có thông tin vị trí'}</small>
                {station.description && (
                  <div className="mt-2">
                    <small className="text-muted">{station.description}</small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Station;