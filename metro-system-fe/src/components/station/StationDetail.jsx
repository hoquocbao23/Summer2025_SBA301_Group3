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
          Quay lại danh sách ga
        </Button>
        <h3>Không tìm thấy ga</h3>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
        Quay lại danh sách ga
      </Button>
      <Row>
        <Col xs={12} md={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            {station.imageUrl && (
              <Card.Img
                variant="top"
                src={station.imageUrl}
                alt={station.stationName}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <h3 className="mb-2">{station.stationName}</h3>
              <p className="text-muted mb-3">{station.stationLocation}</p>
              <Badge bg={station.status === 'ACTIVE' ? 'success' : 'secondary'} className="mb-2">
                {station.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
              <hr />
              <h5 className="mt-3">Mô tả</h5>
              <p>{station.description}</p>

              <div className="mt-4">
                <h6 className="text-muted mb-2">Thông tin chi tiết:</h6>
                <div className="row">

                </div>
                <div className="row mt-2">
                  <div className="col-sm-4">
                    <strong>Vị trí:</strong>
                  </div>
                  <div className="col-sm-8">
                    {station.stationLocation}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-sm-4">
                    <strong>Trạng thái:</strong>
                  </div>
                  <div className="col-sm-8">
                    <Badge bg={station.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {station.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationDetail;