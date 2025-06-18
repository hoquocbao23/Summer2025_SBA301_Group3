import { useState } from 'react';
import { Form, InputGroup, Button, Accordion, Row, Col } from 'react-bootstrap';
import { ArrowDownUp, Plus, Dash } from 'react-bootstrap-icons';
import './TicketSearchTool.css';
import { useNavigate } from 'react-router-dom';
import { availableStations } from '../../data/stations';

const SingleTripForm = ({ initialData }) => {
    const [singleForm, setSingleForm] = useState(initialData || {
        fromStationId: '',
        fromStation : '',
        toStationId: '',
        toStation : '',
        numberOfTickets: 1,
    });

    const navigate = useNavigate();

    const handleSearch = () => {
        // Navigate to ticket layout with form data
        navigate('/tickets', { 
            state: { 
                singleForm: singleForm 
            }
        });
    };

    return (
        <Form>
            <Row>
                <Col md={8}>
                    {/* Route Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label>Route</Form.Label>
                        <InputGroup>
                            <Form.Select
                                value={singleForm.fromStationId}
                                onChange={(e) => setSingleForm({ ...singleForm, fromStationId: e.target.value, fromStation: e.target.options[e.target.selectedIndex].text })}
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
                                value={singleForm.toStationId}
                                onChange={(e) => setSingleForm({ ...singleForm, toStationId: e.target.value, toStation: e.target.options[e.target.selectedIndex].text })}
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
                                            {singleForm.numberOfTickets} {singleForm.numberOfTickets === 1 ? 'Ticket' : 'Tickets'}
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
                                                    onClick={() => setSingleForm({ ...singleForm, numberOfTickets: Math.max(1, singleForm.numberOfTickets - 1) })}
                                                >
                                                    <Dash />
                                                </Button>
                                                <span className="mx-3 fw-bold">{singleForm.numberOfTickets}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => setSingleForm({ ...singleForm, numberOfTickets: Math.min(10, singleForm.numberOfTickets + 1) })}
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
                        disabled={!singleForm.fromStationId || !singleForm.toStationId || singleForm.fromStationId === singleForm.toStationId}
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