package com.sba301.metro_system.dto.request.payment;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private String productName;
    private String description;
    private double price;
    private int quantity;

}
