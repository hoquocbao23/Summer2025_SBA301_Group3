package com.sba301.metro_system.service.implement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sba301.metro_system.dto.request.PaymentRequestDto;
import com.sba301.metro_system.service.IPaymentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final PayOS payOS;

    @Override
    public String createCheckout(PaymentRequestDto paymentRequestDto) throws Exception {
        ItemData item = ItemData
                .builder()
                .name(paymentRequestDto.getProductName())
                .price(1000)
                .quantity(paymentRequestDto.getQuantity())
                .build();

        String currentTimeString = String.valueOf(String.valueOf(new Date().getTime()));
        long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

        PaymentData paymentData = PaymentData
                .builder()
                .orderCode(orderCode)
                .description(paymentRequestDto.getDescription())
                .amount(1000)
                .expiredAt( (Instant.now().getEpochSecond() + 900) )
                .item(item)
                .returnUrl(paymentRequestDto.getReturnUrl())
                .cancelUrl(paymentRequestDto.getCancelUrl())
                .build();
        CheckoutResponseData data = payOS.createPaymentLink(paymentData);
        return data.getCheckoutUrl();
    }


    public PaymentLinkData cancelOrder(long orderId, String cancellationReason ) throws Exception {
            PaymentLinkData order = payOS.cancelPaymentLink(orderId, null);
            return order;
    }
}
