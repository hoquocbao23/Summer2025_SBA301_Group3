import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import './PromotionInput.scss';

const PromotionInput = ({ onPromotionChange }) => {
    const [promotionCode, setPromotionCode] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [showPromotions, setShowPromotions] = useState(false);

    // Mock data for available promotions
    const availablePromotions = [
        { code: 'SUMMER2024', discount: '20% off', description: 'Summer special discount' },
        { code: 'WELCOME10', discount: '10% off', description: 'Welcome discount for new users' },
        { code: 'WEEKEND15', discount: '15% off', description: 'Weekend special offer' }
    ];

    const handlePromotionChange = (e) => {
        const value = e.target.value.toUpperCase();
        setPromotionCode(value);
        setIsValid(true);
        onPromotionChange(value);
    };

    const handleApply = () => {
        if (!promotionCode.trim()) {
            setIsValid(false);
            return;
        }
        // Here you can add your promotion validation logic
        onPromotionChange(promotionCode);
    };

    const handlePromotionSelect = (code) => {
        setPromotionCode(code);
        setIsValid(true);
        onPromotionChange(code);
    };

    return (
        <div className="promotion-input">
            <div className="promotion-wrapper">
                <div className="promotion-header">
                    <h3>Promotion Code</h3>
                </div>
                <div className="promotion-body">
                    <div className="input-group">
                        <Form.Control
                            type="text"
                            placeholder="Enter promotion code"
                            value={promotionCode}
                            onChange={handlePromotionChange}
                            className={!isValid ? 'is-invalid' : ''}
                        />
                        <button 
                            className="apply-btn"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                    {!isValid && (
                        <div className="error-message">
                            Please enter a valid promotion code
                        </div>
                    )}

                    <div className="available-promotions">
                        <div 
                            className="promotions-toggle"
                            onClick={() => setShowPromotions(!showPromotions)}
                        >
                            <span>Available Promotions</span>
                            <i className={`fas fa-chevron-${showPromotions ? 'up' : 'down'}`}></i>
                        </div>
                        
                        {showPromotions && (
                            <div className="promotions-list">
                                {availablePromotions.map((promo, index) => (
                                    <div 
                                        key={index}
                                        className="promotion-item"
                                        onClick={() => handlePromotionSelect(promo.code)}
                                    >
                                        <div className="promo-code">{promo.code}</div>
                                        <div className="promo-details">
                                            <div className="promo-discount">{promo.discount}</div>
                                            <div className="promo-description">{promo.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionInput; 