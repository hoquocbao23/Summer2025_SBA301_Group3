import { useState, useEffect, useContext } from 'react';
import { Form, InputGroup, Button, Accordion, Row, Col, Spinner } from 'react-bootstrap';
import { ArrowDownUp, Plus, Dash } from 'react-bootstrap-icons';
import './TicketSearchTool.css';
import { useNavigate, useLocation } from 'react-router-dom';
import StationService from '../../services/stationService';
import { availableStations } from '../../data/stations';
import { TicketContext } from '../../pages/layout/TicketLayout';

const SingleTripForm = ({ initialData, onSearch }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we're on the tickets page and if context is available
    const isOnTicketsPage = location.pathname === '/tickets';
    const context = isOnTicketsPage ? useContext(TicketContext) : null;
    
    const [singleForm, setSingleForm] = useState(initialData || {
        fromStationId: '',
        fromStation : '',
        toStationId: '',
        toStation : '',
        numberOfTickets: 1,
    });

    // Update form when context changes (for tickets page)
    useEffect(() => {
        if (context?.singleForm && isOnTicketsPage) {
            setSingleForm(prev => ({
                ...prev,
                ...context.singleForm
            }));
        }
    }, [context?.singleForm, isOnTicketsPage]);

    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch stations from API on component mount
    useEffect(() => {
        const fetchStations = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await StationService.getAllStations();
                
                if (response.data && Array.isArray(response.data)) {
                    setStations(response.data);
                } else {
                    throw new Error('Invalid station data format');
                }
            } catch (err) {
                console.error('Failed to fetch stations:', err);
                console.warn('Using fallback station data');
                
                // Use fallback static data with proper format conversion
                const fallbackStations = availableStations.map(station => ({
                    stationId: station.id,
                    stationName: station.name,
                    stationLocation: station.location,
                    address: `Station ${station.id} Address`,
                    openTime: "05:00",
                    closeTime: "23:00"
                }));
                
                setStations(fallbackStations);
                setError('Using offline station data. Some features may be limited.');
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, []);

    const handleRetryLoadStations = () => {
        const fetchStations = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await StationService.getAllStations();
                
                if (response.data && Array.isArray(response.data)) {
                    setStations(response.data);
                } else {
                    throw new Error('Invalid station data format');
                }
            } catch (err) {
                console.error('Failed to fetch stations:', err);
                setError('Failed to load stations from server. Using offline data.');
                
                // Use fallback static data
                const fallbackStations = availableStations.map(station => ({
                    stationId: station.id,
                    stationName: station.name,
                    stationLocation: station.location,
                    address: `Station ${station.id} Address`,
                    openTime: "05:00",
                    closeTime: "23:00"
                }));
                
                setStations(fallbackStations);
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    };

    const updateForm = (newFormData) => {
        setSingleForm(newFormData);
        
        // Update context if on tickets page
        if (isOnTicketsPage && context?.setSingleForm) {
            context.setSingleForm(newFormData);
        }
    };

    const handleSwapStations = () => {
        const newForm = {
            ...singleForm,
            fromStationId: singleForm.toStationId,
            fromStation: singleForm.toStation,
            toStationId: singleForm.fromStationId,
            toStation: singleForm.fromStation
        };
        
        updateForm(newForm);
    };

    const handleSearch = () => {
        // Validate form before navigation/search
        if (!singleForm.fromStationId || !singleForm.toStationId) {
            setError('Please select both departure and destination stations');
            return;
        }
        
        if (singleForm.fromStationId === singleForm.toStationId) {
            setError('Departure and destination stations cannot be the same');
            return;
        }

        // Clear any previous errors
        setError(null);
        
        if (isOnTicketsPage) {
            // If we're on the tickets page, update context and trigger search
            if (context?.setSingleForm) {
                context.setSingleForm(singleForm);
            }
            // Use context's search handler if available
            if (context?.onFormSearch) {
                context.onFormSearch(singleForm);
            } else if (onSearch) {
                // Fallback to onSearch prop
                onSearch(singleForm);
            }
        } else {
            // If we're on home page, navigate to ticket layout with form data
            navigate('/tickets', { 
                state: { 
                    singleForm: singleForm 
                }
            });
        }
    };

    return (
        <Form>
            {/* Error Message */}
            {error && (
                <div className="alert alert-warning mb-3 d-flex justify-content-between align-items-center" role="alert">
                    <span>{error}</span>
                    {error.includes('Failed to load') && (
                        <Button variant="outline-primary" size="sm" onClick={handleRetryLoadStations}>
                            Retry
                        </Button>
                    )}
                </div>
            )}
            
            <Row>
                <Col md={8}>
                    {/* Route Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label>Route</Form.Label>
                        <InputGroup>
                            <Form.Select
                                value={singleForm.fromStationId}
                                onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    updateForm({ 
                                        ...singleForm, 
                                        fromStationId: e.target.value, 
                                        fromStation: selectedOption.text 
                                    });
                                    // Clear error when user makes a selection
                                    if (error) setError(null);
                                }}
                                disabled={loading}
                            >
                                <option value="">
                                    {loading ? 'Loading stations...' : 'From station'}
                                </option>
                                {stations.map((station) => (
                                    <option key={station.stationId} value={station.stationId}>
                                        {station.stationName}
                                    </option>
                                ))}
                            </Form.Select>

                            <Button 
                                variant="outline-secondary" 
                                onClick={handleSwapStations}
                                disabled={loading || !singleForm.fromStationId || !singleForm.toStationId}
                                title="Swap stations"
                            >
                                <ArrowDownUp />
                            </Button>

                            <Form.Select
                                value={singleForm.toStationId}
                                onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    updateForm({ 
                                        ...singleForm, 
                                        toStationId: e.target.value, 
                                        toStation: selectedOption.text 
                                    });
                                    // Clear error when user makes a selection
                                    if (error) setError(null);
                                }}
                                disabled={loading}
                            >
                                <option value="">
                                    {loading ? 'Loading stations...' : 'To station'}
                                </option>
                                {stations.map((station) => (
                                    <option key={station.stationId} value={station.stationId}>
                                        {station.stationName}
                                    </option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                        
                        {/* Station count info */}
                        {!loading && stations.length > 0 && (
                            <Form.Text className="text-muted">
                                {stations.length} stations available
                            </Form.Text>
                        )}
                        
                        {/* Loading indicator */}
                        {loading && (
                            <Form.Text className="text-muted d-flex align-items-center mt-1">
                                <Spinner animation="border" size="sm" className="me-2" />
                                Loading stations...
                            </Form.Text>
                        )}
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
                                                    onClick={() => updateForm({ ...singleForm, numberOfTickets: Math.max(1, singleForm.numberOfTickets - 1) })}
                                                >
                                                    <Dash />
                                                </Button>
                                                <span className="mx-3 fw-bold">{singleForm.numberOfTickets}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateForm({ ...singleForm, numberOfTickets: Math.min(10, singleForm.numberOfTickets + 1) })}
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
                        disabled={
                            loading || 
                            !singleForm.fromStationId || 
                            !singleForm.toStationId || 
                            singleForm.fromStationId === singleForm.toStationId
                        }
                        onClick={handleSearch}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                LOADING...
                            </>
                        ) : (
                            'SEARCH TICKETS'
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default SingleTripForm;