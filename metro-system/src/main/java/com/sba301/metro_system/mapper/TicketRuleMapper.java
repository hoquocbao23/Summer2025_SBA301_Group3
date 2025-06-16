package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.request.ticketrule.TicketRuleRequest;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleListResponse;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleResponse;
import com.sba301.metro_system.entity.TicketRule;
import com.sba301.metro_system.enums.Status;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TicketRuleMapper {

    public TicketRuleResponse toTicketRuleResponse(TicketRule ticketRule) {
        if (ticketRule == null) {
            return null;
        }

        return TicketRuleResponse.builder()
                .ruleId(ticketRule.getRuleId())
                .ruleName(ticketRule.getRuleName())
                .description(ticketRule.getDescription())
                .basePrice(ticketRule.getBasePrice())
                .pricePerKm(ticketRule.getPricePerKm())
                .status(ticketRule.getStatus())
                .build();
    }

    public TicketRule toEntity(TicketRuleRequest request) {
        if (request == null) {
            return null;
        }

        TicketRule ticketRule = new TicketRule();
        ticketRule.setRuleName(request.ruleName());
        ticketRule.setDescription(request.description());
        ticketRule.setBasePrice(request.basePrice());
        ticketRule.setPricePerKm(request.pricePerKm());
        ticketRule.setStatus(request.status() != null ? request.status() : Status.ACTIVE);
        ticketRule.setDelete(false);

        return ticketRule;
    }

    public void updateEntity(TicketRule ticketRule, TicketRuleRequest request) {
        if (ticketRule == null || request == null) {
            return;
        }

        if (request.ruleName() != null) {
            ticketRule.setRuleName(request.ruleName());
        }
        if (request.description() != null) {
            ticketRule.setDescription(request.description());
        }
        if (request.basePrice() != null) {
            ticketRule.setBasePrice(request.basePrice());
        }
        if (request.pricePerKm() != null) {
            ticketRule.setPricePerKm(request.pricePerKm());
        }
        if (request.status() != null) {
            ticketRule.setStatus(request.status());
        }
    }

    public List<TicketRuleResponse> toResponseList(List<TicketRule> ticketRules) {
        if (ticketRules == null) {
            return null;
        }

        return ticketRules.stream()
                .map(this::toTicketRuleResponse)
                .collect(Collectors.toList());
    }

    public TicketRuleListResponse toListResponse(List<TicketRule> ticketRules, String message) {
        if (ticketRules == null) {
            return TicketRuleListResponse.builder()
                    .ticketRules(List.of())
                    .totalCount(0)
                    .build();
        }

        List<TicketRuleResponse> responses = toResponseList(ticketRules);
        
        return TicketRuleListResponse.builder()
                .ticketRules(responses)
                .totalCount(responses.size())
                .build();
    }

    public TicketRule toNewEntity(TicketRuleRequest request) {
        if (request == null) {
            return null;
        }

        TicketRule ticketRule = new TicketRule();
        ticketRule.setRuleName(request.ruleName());
        ticketRule.setDescription(request.description());
        ticketRule.setBasePrice(request.basePrice());
        ticketRule.setPricePerKm(request.pricePerKm());
        ticketRule.setStatus(request.status() != null ? request.status() : Status.ACTIVE);
        ticketRule.setDelete(false);

        return ticketRule;
    }
}
