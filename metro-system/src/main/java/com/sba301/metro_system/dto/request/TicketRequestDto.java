package com.sba301.metro_system.dto.request;

import com.sba301.metro_system.entity.Station;
import lombok.Data;

@Data
public class TicketRequestDto {
    private long departureStation;
    private long arrivalStation;
    private long routeId;
    private long ticketTypeId;
    private String promotionCode;

}
