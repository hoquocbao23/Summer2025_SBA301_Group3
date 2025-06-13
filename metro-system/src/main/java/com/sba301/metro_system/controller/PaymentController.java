package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.PaymentRequestDto;
import com.sba301.metro_system.service.implement.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseApi<?> createPayment(@RequestBody PaymentRequestDto paymentRequestDto) throws Exception {
        return ResponseApi
                .builder()
                .status(HttpStatus.CREATED.value())
                .message(HttpStatus.CREATED.getReasonPhrase())
                .data(paymentService.createCheckout(paymentRequestDto))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseApi<?> cancelPayment(@PathVariable("id") long orderId, String cancellationReason) throws Exception {
        System.out.println();
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(paymentService.cancelOrder(orderId, cancellationReason))
                .build();
    }

}
