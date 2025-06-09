package com.sba301.metro_system.dto.response;

import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.Status;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PromotionResponseDto {
    private Long promotionId;
    private String promotionName;
    private String promotionCode;
    private BigDecimal promotionDiscount;


    private LocalDateTime fromDate;


    private LocalDateTime toDate;


    private Status status;

    private TicketTypeResponseDto ticketType;
}
