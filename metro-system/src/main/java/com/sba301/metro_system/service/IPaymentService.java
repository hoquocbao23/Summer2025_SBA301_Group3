package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.PaymentRequestDto;
import jakarta.servlet.http.HttpServletResponse;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;

public interface IPaymentService  {
    String createCheckout(PaymentRequestDto paymentRequestDto) throws Exception;

}
