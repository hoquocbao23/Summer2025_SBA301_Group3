package com.sba301.metro_system.dto.response.ticketrule;

import lombok.Builder;

import java.util.List;

@Builder
public record TicketRuleListResponse(
        List<TicketRuleResponse> ticketRules,
        Integer totalCount
) {
}
