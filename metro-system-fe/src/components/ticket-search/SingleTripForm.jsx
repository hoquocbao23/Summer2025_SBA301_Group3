import { useState } from 'react';
import { Form, InputGroup, Button, Accordion, Row, Col } from 'react-bootstrap';
import { ArrowDownUp, Plus, Dash } from 'react-bootstrap-icons';
import './TicketSearchTool.css';
import { useNavigate } from 'react-router-dom';
import { availableStations } from '../../data/stations';

const SingleTripForm = () => {
    
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const navigate = useNavigate();

    const handlePassengerChange = (operation) => {
        if (operation === 'add' && numberOfTickets < 10) {
            setNumberOfTickets(prev => prev + 1);
        }
        else if (operation === 'subtract' && numberOfTickets > 1) {
            setNumberOfTickets(prev => prev - 1);
        }
    }

    const handleSearch = () => {
        navigate(`/tickets?from=${from}&to=${to}&numberOfTickets=${numberOfTickets}`);
    }

    return (
        <Form>
            <Row>
                <Col md={8}>
                    {/* Route Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label>Route</Form.Label>
                        <InputGroup>
                            <Form.Select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            >
                                <option>From station</option>
                                {availableStations.map((station) => (
                                    <option key={station.id} value={station.id}>{station.name}</option>
                                ))}
                            </Form.Select>

                            <Button variant="outline-secondary">
                                <ArrowDownUp />
                            </Button>

                            <Form.Select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            >
                                <option value="">To station</option>
                                {availableStations.map((station) => (
                                    <option key={station.id} value={station.id}>{station.name}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    {/* Number of Tickets */}
                    <Form.Group className="mb-3">
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div>
                                        Number of Tickets
                                        <div className="text-muted small">
                                            {numberOfTickets} {numberOfTickets === 1 ? 'Ticket' : 'Tickets'}
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="passenger-selector">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold">Tickets</div>
                                                <div className="text-muted small">Maximum 10 tickets per purchase</div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handlePassengerChange('subtract')}
                                                >
                                                    <Dash />
                                                </Button>
                                                <span className="mx-3 fw-bold">{numberOfTickets}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handlePassengerChange('add')}
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Form.Group>
                </Col>

                <Col md={4} className="d-flex align-items-center">
                    <Button 
                        variant="danger" 
                        size="lg" 
                        className="w-100"
                        disabled={!from || !to || from === to}
                        onClick={handleSearch}
                    >
                        SEARCH TICKETS
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SingleTripForm;