package com.sba301.metro_system.dto.request.ticketdetail;

import lombok.Data;

@Data
public class CheckTicketRequestDto {
    private long ticketId;
    private long stationId;
}
