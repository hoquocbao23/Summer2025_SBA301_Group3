package com.sba301.metro_system.dto.request.ticket;

import lombok.Data;

import java.util.HashSet;

@Data
public class TicketRequestDto {

    private long departureStation;
    private long arrivalStation;
    private long routeId;
    private long ticketTypeId;
    private String promotionCode;


}
