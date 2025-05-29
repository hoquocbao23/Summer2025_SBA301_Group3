import React from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CircleFill } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';

const Station = () => {
  const navigate = useNavigate();
  const stations = [
    {
      id: 1,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Ben Thanh",
      toStation: "Ba Son",
      frequency: "Every day",
      price: "$238",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",

    },
    {
      id: 2,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Ba Son",
      toStation: "Hiep Thanh",
      frequency: "Week days",
      price: "$248",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    },
    {
      id: 3,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Hiep Thanh",
      toStation: "Thao Dien",
      frequency: "Week days",
      price: "$258.00",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    },
    {
      id: 4,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Thao Dien",
      toStation: "An Phu",
      frequency: "Every day",
      price: "$238",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    },
    {
      id: 5,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "An Phu",
      toStation: "Tan Cang",
      frequency: "Week days",
      price: "$248",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    },
    {
      id: 6,
      fromCity: "Ho Chi Minh City",
      toCity: "Ho Chi Minh City",
      fromStation: "Tan Cang",
      toStation: "Ben Thanh",
      frequency: "Week days",
      price: "$258.00",
      image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/1/1186900/Z4306702702535_Cfd7b.jpg",
    },
  ];

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
          <Col key={station.id} xs={12} md={6} lg={4}>
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ cursor: 'pointer' }} 
              onClick={
                () => navigate('/station-detail', { state: { station } })
              } // Navigate on click
            >
              <div className="card-img-container">
                <Card.Img
                  variant="top"
                  src={station.image}
                  alt={`${station.fromStation} to ${station.toStation}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: station.overlay,
                  }}
                ></div>
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
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-0">{station.fromStation}</h5>
                    <small className="text-muted">{station.fromCity}</small>
                  </div>
                  <div className="text-end">
                    <h5 className="mb-0">{station.toStation}</h5>
                    <small className="text-muted">{station.toCity}</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted">{station.frequency}</span>
                  <div className="text-end">
                    <small className="text-muted me-1">From</small>
                    <span className="text-danger fw-bold">{station.price}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Station;