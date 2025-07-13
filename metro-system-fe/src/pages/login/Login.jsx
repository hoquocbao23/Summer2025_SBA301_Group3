import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import './Login.scss';
import axiosInstance from '../../config/axios';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/security/login', {
        email: email,
        password: password
      });

      const { status, message, data } = response.data;

      if (status === 200) {
        // Đăng nhập thành công
        const { id, token, fullname, role } = data;

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("role", role);

        setSuccess(`Đăng nhập thành công! Chào mừng ${fullname}`);

        // Chuyển hướng dựa trên vai trò
        if (role === "ADMIN") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        // Xử lý các mã trạng thái khác
        setError(data || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);

      if (err.response) {
        // Máy chủ phản hồi với lỗi
        const data = err.response;
        if (data.status === 401) {
          setError(data?.data || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } else {
          setError(data?.data || "Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } else if (err.request) {
        // Không nhận được phản hồi
        setError("Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối internet.");
      } else {
        // Lỗi khác
        setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center">
          {/* Cột trái: Form đăng nhập */}
          <Col md={4} className="login-form-col">
            <Card className="login-card">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">Đăng nhập</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nhập email của bạn *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Nhập mật khẩu của bạn *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Ghi nhớ đăng nhập"
                    />
                    <a href="#" className="text-decoration-none">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <Button variant="danger" type="submit" className="w-100 mb-3" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <Button
                    variant="outline-primary"
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                    onClick={() => window.location.href = "/signup"}
                  >
                    <i className="fab fa-facebook-f me-2"></i> Đăng nhập với Facebook
                  </Button>

                  <Button
                    variant="outline-danger"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() => window.location.href = "/signup"}
                  >
                    <i className="fab fa-google-plus-g me-2"></i> Đăng nhập với Google+
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột phải: Văn bản giới thiệu */}
          <Col md={8} className="login-text-col">
            <div className="login-text">
              <h1>LƯU Ý ĐĂNG NHẬP</h1>
              <p>
                HCMC Metro) là hệ thống đường sắt đô thị đang xây dựng tại Thành phố Hồ Chí Minh. Dự án là sự kết hợp giữa metro, xe điện mặt đất (tramway) và tàu một ray (monorail).
              </p>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;