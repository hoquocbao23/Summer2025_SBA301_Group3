package com.sba301.metro_system.dto.response;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class BookingResponseDto {
    private long bookingId;
    private String userName;
    private String departureStation;
    private String arrivalStation;
    private Double oldPrice;
    private Double newPrice;
    private LocalDateTime purchaseTime;
    private String ticketName;
    private String promotionCode;
    private String routeName;
    private String urlCheckout;
    private List<TicketResponseDto> tickets;

    private long payOrderCode;
    private int numberOfPassengers;

}
