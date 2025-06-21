import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './PromotionInput.scss';
import axiosInstance from '../../config/axios';

const PromotionInput = ({ ticketType, 
    onPromotionApplied, 
    promotionCode: initialPromotionCode, 
    onPromotionCodeChange 
    }) => {
    const [promotionCode, setPromotionCode] = useState(initialPromotionCode || '');
    const [isValid, setIsValid] = useState(true);
    const [showPromotions, setShowPromotions] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setPromotionCode(initialPromotionCode || '');
    }, [initialPromotionCode]);

    // Auto-apply promotion when component mounts with existing code
    useEffect(() => {
        if (initialPromotionCode && initialPromotionCode.trim() !== '') {
            applyPromotion(initialPromotionCode);
        }
    }, []); // Only run once on mount

    // Mock data for available promotions
    const availablePromotions = [
        { code: 'SUMMER2024', discount: '20% off', description: 'Summer special discount' },
        { code: 'WELCOME10', discount: '10% off', description: 'Welcome discount for new users' },
        { code: 'WEEKEND15', discount: '15% off', description: 'Weekend special offer' }
    ];

    const handlePromotionChange = (e) => {
        const value = e.target.value.toUpperCase();
        setPromotionCode(value);
        onPromotionCodeChange(value);
        setIsValid(true);
        if (!value) {
            onPromotionApplied(null);
        }
    };

    const applyPromotion = async (code) => {
        if (!code) {
            onPromotionApplied(null);
            setIsValid(true);
            return;
        }
        try {
            const response = await axiosInstance.get('/promotions/active', { params: { code, ticketTypeId: ticketType } });
            if (response.status === 200 && response.data) {
                setIsValid(true);
                onPromotionApplied(response.data.data);
            } else {
                setIsValid(false);
                onPromotionApplied(null);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid promotion code');
            setIsValid(false);
            onPromotionApplied(null);
        }
    };

    const handleApply = (promotionCode) => {
        setPromotionCode(promotionCode);
        applyPromotion(promotionCode);
    };

    const handlePromotionSelect = (code) => {
        setPromotionCode(code);
        onPromotionCodeChange(code);
        setIsValid(true);
        applyPromotion(code);
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
                            onClick={() => handleApply(promotionCode)}
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