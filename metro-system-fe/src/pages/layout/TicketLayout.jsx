import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./ticketLayout.css";
import { Outlet, useLocation } from "react-router-dom";
import SingleTripForm from "../../components/ticket-search/SingleTripForm";
const TicketLayout = () => {
    const location = useLocation();
    const [steps, setSteps] = useState([
        { number: 1, label: "TICKETS", active: true },
        { number: 2, label: "PASSENGERS", active: false },
        { number: 3, label: "PAYMENT", active: false },
        { number: 4, label: "VALIDATION", active: false },
    ]);

    useEffect(() => {
        const path = location.pathname;
        const newSteps = steps.map(step => {
            switch (step.number) {
                case 1:
                    return { ...step, active: path === "/tickets" };
                case 2:
                    return { ...step, active: path === "/tickets/passenger" };
                case 3:
                    return { ...step, active: path === "/tickets/payment" };
                case 4:
                    return { ...step, active: path === "/tickets/validation" };
                default:
                    return step;
            }
        });
        setSteps(newSteps);
    }, [location.pathname]);

    return (
        <div className="ticket-layout">
            <div className="ticket-search" style={{ background: "#00000099", padding: "24px 0", color: "white" }}>
                <Container>
                    <Row className="justify-content-center">
                        <SingleTripForm/>
                    </Row>
                </Container>
            </div>

            <Row className="mt-4 text-center">
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={
                                `step-item ${step.active ? "active" : ""} 
                                    ${index !== steps.length - 1 ? "arrow-right" : ""}`
                            }
                            style={{
                                zIndex: `${steps.length - index}`,
                            }}
                        >
                            <span className="step-number">{step.number}</span>
                            <span className="step-label">{step.label}</span>
                        </div>
                    ))}
                </div>
            </Row>
            
            <Outlet />
        </div>

    );
};

export default TicketLayout;
