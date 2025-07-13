package com.sba301.metro_system.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketDetailResponseDto {
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String routeName;

    private String checkinStation;
    private String checkoutStation;


}
