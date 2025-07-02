import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './TicketSearchTool.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { RouteService } from '../../services/routeService';

const TravelPassForm = ({ initialData }) => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [travelPassForm, setTravelPassForm] = useState(initialData || {
        routeId: '',
        routeName: '',
        ticketTypeId: '',
        ticketName: '',
        basePrice: 0,
    });

    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [availableTicketTypes, setAvailableTicketTypes] = useState([]);

    // const fetchAvailableRoutes = async () => {
    //     try {
    //         const response = await axiosInstance.get('/routes');
    //         setAvailableRoutes(response.data);
    //     } catch (error) {
    //         console.error('Error fetching available routes:', error);
    //     }
    // };

    const fetchAvailableRoutes = async () => {

        const routes = await RouteService.getAllRoutes();

        setAvailableRoutes(routes.data.routes);
        console.log("availableRoutes", availableRoutes);
    };


    const fetchAvailableTicketTypes = async () => {
        try {
            const response = await axiosInstance.get('/ticket-types/unlimit');
            setAvailableTicketTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching available ticket types:', error);
        }
    };

    const getRouteDetails = async (routeId, ticketType) => {
        try {
            const response = await axiosInstance.get(`/rules/detail?routeId=${routeId}&ticketType=${ticketType}`);
            console.log("response", response.data.data);
            return {
                basePrice: response.data.data.ticketRule.basePrice,
            }
        } catch (error) {
            console.error('Error fetching route details:', error);
        }
    };

    useEffect(() => {
        console.log("travelPassForm updated:", travelPassForm);
    }, [travelPassForm]);

    useEffect(() => {
        fetchAvailableRoutes();
        fetchAvailableTicketTypes();
    }, []);



    // Add useEffect to log state changes

    const handleSearch = async () => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            // Show login modal if not logged in
            setShowLoginModal(true);
            return;
        }


        const basePrice = await getRouteDetails(travelPassForm.routeId, travelPassForm.ticketTypeId);
        // Update the form with the base price
        // Set state là bất đồng bộ, nên phải lưu tạm trong updatedForm
        const updatedForm = {
            ...travelPassForm,
            basePrice: basePrice.basePrice,
        };
        setTravelPassForm(updatedForm);
        console.log("updatedForm1", updatedForm);
        // Navigate after the state has been updated
        navigate('/tickets', {
            state: {
                travelPassForm: updatedForm
            }
        });

    };

    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        navigate('/login');
    };

    return (
        <>
            <Form>
                <Row>
                    <Col md={8}>
                        {/* Route Selection */}
                        <Form.Group className="mb-3">
                            <Form.Label>Route</Form.Label>
                            <Form.Select
                                value={travelPassForm.routeId}
                                onChange={(e) =>  setTravelPassForm({
                                    ...travelPassForm, routeId: e.target.value,
                                    routeName: e.target.options[e.target.selectedIndex].text
                                })}
                                className="mb-3"
                            >
                                <option value="">Select route</option>
                                {availableRoutes.map((route) => (
                                    <option key={route.routeId} value={route.routeId}>{route.routeName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Ticket Type Selection */}
                        <Form.Group className="mb-3">
                            <Form.Label>Pass Type</Form.Label>
                            <Form.Select
                                value={travelPassForm.ticketTypeId}
                                onChange={(e) => setTravelPassForm({
                                    ...travelPassForm, ticketTypeId: e.target.value,
                                    ticketName: e.target.options[e.target.selectedIndex].text
                                })}
                                className="mb-3"
                            >
                                <option value="">Select pass type</option>
                                {availableTicketTypes.map((ticketType) => (
                                    <option key={ticketType.ticketTypeId} value={ticketType.ticketTypeId}>{ticketType.ticketName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4} className="d-flex align-items-center">
                        <Button
                            variant="danger"
                            size="lg"
                            className="w-100"
                            disabled={!travelPassForm.routeId || !travelPassForm.ticketTypeId}
                            onClick={handleSearch}
                        >
                            SEARCH PASSES
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Login Modal */}
            <Modal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-danger fw-bold">Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3">
                        <i className="bi bi-person-circle text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <p className="mb-0 fs-5">Please log in to continue searching for passes.</p>
                    <p className="text-muted small mt-2">You need to be logged in to view and purchase passes.</p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowLoginModal(false)}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleLoginRedirect}
                        className="px-4"
                        style={{
                            backgroundColor: '#dc3545',
                            borderColor: '#dc3545',
                            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
                        }}
                    >
                        Go to Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TravelPassForm;