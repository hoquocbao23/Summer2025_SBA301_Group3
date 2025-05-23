import { Container, Row, Col, ListGroup, ListGroupItem, Nav } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 ">
            <Container>
                <Row className="g-4">
                    {/* Contact Information */}
                    <Col md={4}>
                        <h5 className="border-bottom border-secondary pb-2 mb-3">Contact Us</h5>
                        <ListGroup variant="flush" className="bg-dark">
                            <ListGroupItem className="bg-dark text-white border-0 ps-0">
                                <FaMapMarkerAlt className="me-2 text-primary" />
                                123 Metro Street, City
                            </ListGroupItem>
                            <ListGroupItem className="bg-dark text-white border-0 ps-0">
                                <FaPhone className="me-2 text-primary" />
                                +1 234 567 890
                            </ListGroupItem>
                            <ListGroupItem className="bg-dark text-white border-0 ps-0">
                                <FaEnvelope className="me-2 text-primary" />
                                info@metroticket.com
                            </ListGroupItem>
                        </ListGroup>
                    </Col>

                    {/* Quick Links */}
                    <Col md={4}>
                        <h5 className="border-bottom border-secondary pb-2 mb-3">Quick Links</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="/tickets" className="text-white ps-0">Ticket</Nav.Link>
                            <Nav.Link href="/stations" className="text-white ps-0">Station</Nav.Link>
                            <Nav.Link href="/routes" className="text-white ps-0">Route</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Social Media */}
                    <Col md={4}>
                        <h5 className="border-bottom border-secondary pb-2 mb-3">Follow Us</h5>
                        <div className="d-flex gap-3">
                            <Nav.Link href="#" className="text-white p-0">
                                <FaFacebook className="fs-4" />
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white p-0">
                                <FaTwitter className="fs-4" />
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white p-0">
                                <FaInstagram className="fs-4" />
                            </Nav.Link>
                        </div>
                    </Col>
                </Row>

                {/* Copyright */}
                <Row>
                    <Col className="text-center mt-4 pt-3 border-top border-secondary">
                        <p className="mb-0">
                            © {new Date().getFullYear()} Metro Ticket System. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;