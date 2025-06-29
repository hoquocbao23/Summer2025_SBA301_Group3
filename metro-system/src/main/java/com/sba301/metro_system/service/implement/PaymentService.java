package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;
import com.sba301.metro_system.service.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
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

    @Value("${RETURN_URL}")
    private String RETURN_URL;

    @Value("${CANCEL_URL}")
    private String CANCEL_URL;

    @Override
    public CheckoutResponseData createCheckout(PaymentRequestDto paymentRequestDto) throws Exception {
        ItemData item = ItemData
                .builder()
                .name(paymentRequestDto.getProductName())
                .price(2000)
                .quantity(paymentRequestDto.getQuantity())
                .build();

        String currentTimeString = String.valueOf(String.valueOf(new Date().getTime()));
        long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

        PaymentData paymentData = PaymentData
                .builder()
                .orderCode(orderCode)
                .description(paymentRequestDto.getDescription())
                .amount(2000)
                .expiredAt( (Instant.now().getEpochSecond() + 900) )
                .item(item)
                .returnUrl(RETURN_URL)
                .cancelUrl(CANCEL_URL)
                .build();
        CheckoutResponseData data = payOS.createPaymentLink(paymentData);
//        return data.getCheckoutUrl();
        return data;
    }


    public PaymentLinkData cancelOrder(long orderId, String cancellationReason ) throws Exception {
            PaymentLinkData order = payOS.cancelPaymentLink(orderId, cancellationReason);
            return order;
    }

    public PaymentLinkData getPaymentInform(long orderId ) throws Exception {
        PaymentLinkData order = payOS.getPaymentLinkInformation(orderId);
        return order;
    }

}
