import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import './TicketSearchTool.css';

const TravelPassForm = () => {
    const [routeId, setRouteId] = useState('');
    const [ticketTypeId, setTicketTypeId] = useState('');
    

    return (
        <Form>
            <Row>
                <Col md={8}>
                    {/* Route Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label>Route</Form.Label>
                        <Form.Select
                            value={routeId}
                            onChange={(e) => setRouteId(e.target.value)}
                            className="mb-3"
                        >
                            <option value="">Select route</option>
                            <option value="1">Bến Thành - Suối Tiên</option>
                            <option value="2">Suối Tiên - Biên Hoà</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Ticket Type Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label>Pass Type</Form.Label>
                        <Form.Select
                            value={ticketTypeId}
                            onChange={(e) => setTicketTypeId(e.target.value)}
                            className="mb-3"
                        >
                            <option value="">Select pass type</option>
                            <option value="1">1-Day Pass (24 hours)</option>
                            <option value="2">7-Day Pass (168 hours)</option>
                            <option value="3">30-Day Pass (720 hours)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={4} className="d-flex align-items-center">
                    <Button 
                        variant="danger" 
                        size="lg" 
                        className="w-100"
                        disabled={!routeId || !ticketTypeId}
                    >
                        SEARCH PASSES
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default TravelPassForm;