package com.sba301.metro_system.dto.request;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private String productName;
    private String description;
    private String returnUrl;
    private String cancelUrl;
    private long price;
    private int quantity;

}
