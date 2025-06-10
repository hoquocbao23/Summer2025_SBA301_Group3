import React from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { ArrowDownUp } from 'react-bootstrap-icons';
import './TicketSearchTool.css'; // file CSS bổ sung

const TicketSearchTool = () => {
  return (
    <div className="hero-container">
        <div className="content-wrapper">
            <Container fluid className="h-100">
                <Row className="h-100 align-items-center">
                {/* Left Content */}
                <Col md={6} className="text-white ps-5">
                    <h1 className="display-5 fw-bold">WELCOME TO</h1>
                    <h1 className="display-4 fw-bolder">HCMC METRO</h1>
                    <p className="lead">
                    We save your time both while purchasing, <br />
                    the check-in and during the travel
                    </p>
                </Col>

                {/* Right Form */}
                <Col md={5} className="offset-md-1">
                    <Card className="p-4 form-card">
                    <Form>
                        {/* Travelling Route */}
                        <Form.Group className="mb-3">
                        <Form.Label>Travelling Route</Form.Label>
                        <InputGroup>
                            <FormControl placeholder="From" />
                            <Button variant="outline-secondary">
                            <ArrowDownUp />
                            </Button>
                            <FormControl placeholder="To" />
                        </InputGroup>
                        </Form.Group>

                        {/* Travelling Date */}
                        <Form.Group className="mb-3">
                        <Row>
                            <Col>
                            <Form.Select>
                                <option>One Way</option>
                                <option>Round Trip</option>
                            </Form.Select>
                            </Col>
                            <Col>
                            <Form.Select>
                                <option>1 Adult</option>
                                <option>2 Adults</option>
                                <option>3 Adults</option>
                                <option>4 Adults</option>
                            </Form.Select>
                            </Col>
                        </Row>
                        </Form.Group>
                        <Button variant="danger" size="lg" className="w-100">
                        SEARCH TICKETS
                        </Button>
                    </Form>
                    </Card>
                </Col>
                </Row>
            </Container>

        </div>
    </div>
  );
};

export default TicketSearchTool;