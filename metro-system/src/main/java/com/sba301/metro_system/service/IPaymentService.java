package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;

public interface IPaymentService  {
    String createCheckout(PaymentRequestDto paymentRequestDto) throws Exception;


}
