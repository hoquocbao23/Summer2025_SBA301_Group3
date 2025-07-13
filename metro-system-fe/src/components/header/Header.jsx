import { Navbar, Container, Button, Nav, Dropdown } from 'react-bootstrap';
import { FaHome, FaUser } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const navigate = useNavigate();
    const [userFullName, setUserFullName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    useEffect(() => {
        // Check if user is logged in by looking for fullName in localStorage
        const fullName = localStorage.getItem('fullName');
        const role = localStorage.getItem('role');
        if (fullName) {
            setUserFullName(fullName);
        }
        if (role) {
            setUserRole(role);
        }

        // Add event listener for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    // Handle changes to localStorage (login/logout events from other tabs)
    const handleStorageChange = (e) => {
        if (e.key === 'fullName') {
            setUserFullName(e.newValue);
        }
        if (e.key === 'role') {
            setUserRole(e.newValue);
        }
    };
    
    const handleLogout = () => {
        // Clear ALL data from localStorage
        localStorage.clear();
        
        // Reset state variables
        setUserFullName(null);
        setUserRole(null);
        
        // Show logout notification
        alert('Đăng xuất thành công!');
        
        // Navigate to home page
        navigate('/');
    };
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
            <Container>
                <Link to="/" className="text-decoration-none text-white fw-bold">
                    <FaHome className="me-2" />
                    Hệ thống vé Metro
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
                            Vé
                        </NavLink>
                        <NavLink
                            to="/stations"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'text-primary' : 'text-white'} mx-2`
                            }
                        >
                            Nhà ga
                        </NavLink>
                        <NavLink
                            to="/routes"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'text-primary' : 'text-white'} mx-2`
                            }
                        >
                            Tuyến
                        </NavLink>
                    </Nav>
                    <div className="ms-auto">
                        {userFullName ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                                    <FaUser className="me-2" />
                                    {userFullName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {userRole === 'ADMIN' ? (
                                        <Dropdown.Item onClick={() => navigate('/dashboard')}>Bảng điều khiển</Dropdown.Item>
                                    ) : (
                                        <>
                                            <Dropdown.Item onClick={() => navigate('/profile')}>Hồ sơ của tôi</Dropdown.Item>
                                            <Dropdown.Item onClick={() => navigate('/bookings')}>Đặt vé của tôi</Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Button
                                    variant="outline-light"
                                    className="me-2"
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </Button>

                                <Button 
                                    variant="primary"
                                    onClick={() => navigate('/signin')}
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;