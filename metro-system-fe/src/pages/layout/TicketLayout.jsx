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

    const [layoutCurrentStep, setLayoutCurrentStep] = useState(1);

    // Lấy dữ liệu từ SingleTripForm
    // Lưu dữ liệu vào singleForm
    const [singleForm, setSingleForm] = useState({
        ...location.state?.singleForm,
        selectedRoute: null,
        totalPrice: 0,
        estimatedDuration: 0
    });

    // Lấy dữ liệu từ TravelPassForm
    // Lưu dữ liệu vào travelPassForm
    const [travelPassForm, setTravelPassForm] = useState(location.state?.travelPassForm || null);

    

    // Cập nhật formData khi location.state thay đổi
    useEffect(() => {
        if (location.state?.singleForm) {
            setSingleForm(prev => ({
                ...prev,
                ...location.state.singleForm
            }));
        }
        if (location.state?.travelPassForm) {
            setTravelPassForm(location.state.travelPassForm);
            setLayoutCurrentStep(2); // Chuyển sang bước Passenger khi có travelPassForm
        }
    }, [location.state]);

   
    const steps = [
        { number: 1, label: "TICKETS", active: true },
        { number: 2, label: "PASSENGERS", active: false },
        { number: 3, label: "PROMOTION", active: false },
    ];
    
    // Search trigger for SingleTripForm when on tickets page
    const [searchTrigger, setSearchTrigger] = useState(0);
    
    const handleFormSearch = (formData) => {
        // Update the form data and trigger search
        setSingleForm(formData);
        setSearchTrigger(prev => prev + 1); // Increment to trigger search
    };

    const renderCurrentStep = () => {
        switch(layoutCurrentStep) {
            case 1:
                return <TicketSearchOverview onStepChange={setLayoutCurrentStep} searchTrigger={searchTrigger} />;
            case 2:
                return <PassengerPage layoutCurrentStep={layoutCurrentStep} onStepChange={setLayoutCurrentStep} />;
            case 3:
                return <PassengerPage layoutCurrentStep={layoutCurrentStep} onStepChange={setLayoutCurrentStep} />;
            
        }
    };


    return (
        
        ///
        <TicketContext.Provider value={{
             singleForm,  
             setSingleForm,
             travelPassForm,
             setTravelPassForm,
             onFormSearch: handleFormSearch,
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
                                    className={`step-item ${step.number === layoutCurrentStep ? "active" : ""} 
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
