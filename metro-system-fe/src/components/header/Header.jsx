import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
            <Container>
                <Link to="/" className="text-decoration-none text-white fw-bold">
                    <FaHome className="me-2" />
                    Metro Ticket System
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink 
                            to="/tickets" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'text-primary' : 'text-white'} mx-2`
                            }
                        >
                            Ticket
                        </NavLink>
                        <NavLink 
                            to="/stations" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'text-primary' : 'text-white'} mx-2`
                            }
                        >
                            Station
                        </NavLink>
                        <NavLink 
                            to="/routes" 
                            className={({ isActive }) => 
                                `nav-link ${isActive ? 'text-primary' : 'text-white'} mx-2`
                            }
                        >
                            Route
                        </NavLink>
                    </Nav>
                    <div className="ms-auto">
                        <Button variant="outline-light" className="me-2">Login</Button>
                        <Button variant="primary">Sign Up</Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;