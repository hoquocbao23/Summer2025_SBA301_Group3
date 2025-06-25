import React from 'react';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import './TicketSearchTool.css'; // file CSS bổ sung
import SingleTripForm from './SingleTripForm';
import TravelPassForm from './TravelPassForm';


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
                                <Tabs defaultActiveKey="singletrip" id="justify-tab-example" className="mb-3">
                                    <Tab eventKey="singletrip" title="Single Trip" >
                                        <SingleTripForm />
                                    </Tab>

                                    <Tab eventKey="travelpass" title="Travel Pass">
                                        <TravelPassForm />
                                    </Tab>
                                </Tabs>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </div>
        </div>
    );
};

export default TicketSearchTool;

