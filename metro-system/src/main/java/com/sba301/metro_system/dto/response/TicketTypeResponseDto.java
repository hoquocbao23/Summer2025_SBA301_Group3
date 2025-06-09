package com.sba301.metro_system.dto.response;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class TicketTypeResponseDto {
    private Long ticketTypeId;

    private String ticketName;
    private Integer validityDays;
    private String description;
    private Boolean usageLimit;
    private Status status;
}
