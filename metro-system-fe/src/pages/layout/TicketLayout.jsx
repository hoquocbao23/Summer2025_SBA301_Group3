import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./ticketLayout.css";
import { useLocation } from "react-router-dom";
import SingleTripForm from "../../components/ticket-search/SingleTripForm";
import TravelPassForm from "../../components/ticket-search/TravelPassForm";
import { createContext } from "react";
import TicketSearchOverview from "../../components/ticket-search/TicketSearchOverview";
import PassengerPage from "../passenger/passenger-page";

// Context để lưu dữ liệu từ SingleTripForm
export const TicketContext = createContext();

const TicketLayout = () => {


    const location = useLocation();

    const [currentStep, setCurrentStep] = useState(1);

    // Lấy dữ liệu từ SingleTripForm
    // Lưu dữ liệu vào singleForm
    const [singleForm, setSingleForm] = useState(location.state?.singleForm || null);

    // Lấy dữ liệu từ TravelPassForm
    // Lưu dữ liệu vào travelPassForm
    const [travelPassForm, setTravelPassForm] = useState(location.state?.travelPassForm || null);

    

    // Cập nhật formData khi location.state thay đổi
    useEffect(() => {
        if (location.state?.singleForm) {
            setSingleForm(location.state.singleForm);
        }
        if (location.state?.travelPassForm) {
            setTravelPassForm(location.state.travelPassForm);
            setCurrentStep(2); // Chuyển sang bước Passenger khi có travelPassForm
        }
    }, [location.state]);

   
    const steps = [
        { number: 1, label: "TICKETS", active: true },
        { number: 2, label: "PASSENGERS", active: false },
        { number: 3, label: "PAYMENT", active: false },
        { number: 4, label: "VALIDATION", active: false },
    ];
    

    const renderCurrentStep = () => {
        switch(currentStep) {
            case 1:
                return <TicketSearchOverview onStepChange={setCurrentStep} />;
            case 2:
                return <PassengerPage/>;
            default:
                return <TicketSearchOverview onStepChange={setCurrentStep} />;
        }
    };


    return (
        ///
        <TicketContext.Provider value={{
             singleForm,  
             travelPassForm,
        }}>
            { travelPassForm === null  && (
                
                    <div className="ticket-search" style={{ background: "#00000099", padding: "24px 0", color: "white" }}>
                        <Container>
                            <Row className="justify-content-center">
                                <SingleTripForm initialData={singleForm} />
                            </Row>
                        </Container>
                     
                </div>
            )}
            {
                singleForm == null && travelPassForm != null && (
                    
                    <div className="ticket-search" style={{ background: "#00000099", padding: "24px 0", color: "white" }}>
                        <Container>
                            <Row className="justify-content-center">
                                <TravelPassForm initialData={travelPassForm} />
                            </Row>
                        </Container>
                             
                </div>
                )
            }
            <Row className="mt-4 text-center">
                        <div className="steps-container">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`step-item ${step.number === currentStep ? "active" : ""} 
                                        ${index !== steps.length - 1 ? "arrow-right" : ""}`}
                                    style={{ zIndex: `${steps.length - index}` }}
                                >
                                    <span className="step-number">{step.number}</span>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            ))}
                        </div>
            </Row>     
            {renderCurrentStep()}
        </TicketContext.Provider>

    );
};

export default TicketLayout;
