import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import './Login.scss';
import axiosInstance from '../../config/axios';
import axios from 'axios';

const Login = () => {  const [email, setEmail] = useState("");
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
        // Login successful
        const { token, fullname, role } = data;
        
        // Store token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullname);
        localStorage.setItem("role", role);
        
        setSuccess(`Login successful! Welcome ${fullname}`);
        
        // Redirect based on role
        setTimeout(() => {
          if (role === "ADMIN") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/";
          }
        }, 1500);
      } else {
        // Handle other status codes
        setError(data || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        // Server responded with an error
        const { status, data } = err.response;
        if (status === 401) {
          setError(data?.data || "Incorrect email or password. Please try again.");
        } else {
          setError(data?.data || "Login failed. Please try again.");
        }
      } else if (err.request) {
        // No response received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Other error
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center">
          {/* Left Side: Login Form */}
          <Col md={4} className="login-form-col">
            <Card className="login-card">
              <Card.Body>
                <h2 className="mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter your E-mail *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="example@email.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Enter your password *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember"
                      id="remember-checkbox"
                    />
                    <a href="#" className="text-danger">
                      Forget password?
                    </a>
                  </div>                  <Button variant="danger" type="submit" className="w-100 mb-3" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  <Button
                    variant="primary"
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                  >
                    <i className="fab fa-facebook-f me-2"></i> Login with Facebook
                  </Button>

                  <Button
                    variant="danger"
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: '#dd4b39', borderColor: '#dd4b39' }}
                  >
                    <i className="fab fa-google-plus-g me-2"></i> Login with Google+
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side: Placeholder Text */}
          <Col md={8} className="login-text-col">
            <div className="login-text">
              <h1>LOGIN NOTE</h1>
              <p>
HCMC Metro) là hệ thống đường sắt đô thị đang xây dựng tại Thành phố Hồ Chí Minh. Dự án là sự kết hợp giữa metro, xe điện mặt đất (tramway) và tàu một ray (monorail).              </p>
              
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;