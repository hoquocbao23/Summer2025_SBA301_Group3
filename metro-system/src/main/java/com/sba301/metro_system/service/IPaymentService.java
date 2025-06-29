package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;
import vn.payos.type.CheckoutResponseData;

public interface IPaymentService  {
    CheckoutResponseData createCheckout(PaymentRequestDto paymentRequestDto) throws Exception;


}
