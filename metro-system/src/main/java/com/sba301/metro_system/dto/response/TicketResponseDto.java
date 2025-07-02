package com.sba301.metro_system.dto.response;

import com.sba301.metro_system.entity.*;
import com.sba301.metro_system.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class TicketResponseDto {

    private Long ticketId;
    private String userName;
    private String departureStation;
    private String arrivalStation;
    private Double oldPrice;
    private Double newPrice;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private LocalDateTime purchaseTime;
    private String qrUrl;
    private TicketStatus ticketStatus;
    private String ticketName;
    private String promotionCode;
    private String routeName;
    private String urlCheckout;
    private Boolean isCheckIn;
    private Long payOrderCode;
    private int numberOfPassengers;
//    private List<String> userEmails;
}
