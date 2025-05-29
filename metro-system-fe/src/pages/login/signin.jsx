import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaFacebookF, FaGooglePlusG } from 'react-icons/fa';
import './Login.scss'; // Import SCSS file

const SignUp = () => {
  return (
    <div className="login-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center">
          {/* Left Side: Sign Up Form */}
          <Col md={4} className="login-form-col">
            <Card className="login-card">
              <Card.Body>
                <h2 className="mb-4">Sign up</h2>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter your E-mail *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your Email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Enter your Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First name Last name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Enter your password *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm your password *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      required
                    />
                  </Form.Group>

                  <Form.Text className="text-muted mb-3">
                    By signing up, you agree to our terms of use and privacy policy
                  </Form.Text>

                  <Button variant="danger" type="submit" className="w-100 mb-3">
                    Sign Up
                  </Button>

                  <Button
                    variant="primary"
                    className="w-100 mb-2 d-flex align-items-center justify-content-center"
                  >
                    <FaFacebookF className="me-2" />
                    Login with Facebook
                  </Button>

                  <Button
                    variant="danger"
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: '#dd4b39', borderColor: '#dd4b39' }}
                  >
                    <FaGooglePlusG className="me-2" />
                    Login with Google+
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side: Registration Note */}
          <Col md={8} className="login-text-col">
            <div className="login-text">
              <h1>REGISTRATION NOTE</h1>
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

export default SignUp;