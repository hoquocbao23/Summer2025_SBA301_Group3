package com.sba301.metro_system.dto.response.ticketrule;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;

@Builder
public record TicketRuleResponse(
        Long ruleId,
        String ruleName,
        String description,
        Double basePrice,
        Double pricePerKm,
        Status status
) {
}
