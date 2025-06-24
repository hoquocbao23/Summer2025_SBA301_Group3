package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.ticketrule.TicketRuleRequest;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleListResponse;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleResponse;
import com.sba301.metro_system.enums.Status;

import java.util.List;

public interface ITicketRuleService {
    
    // Basic CRUD operations
    TicketRuleListResponse getAllTicketRules();
    TicketRuleResponse createTicketRule(TicketRuleRequest request);
    TicketRuleResponse updateTicketRule(TicketRuleRequest request, Long id);
//    void deleteTicketRule(Long id);
    
    // Search and filter operations
    List<TicketRuleResponse> searchTicketRulesByName(String keyword);
    List<TicketRuleResponse> getTicketRulesByStatus(Status status);
    TicketRuleResponse getTicketRuleByName(String ruleName);
    Double calculateTotalPrice(Long ruleId, Double distance);
    
    // Status management
    void activateTicketRule(Long id);
    void deactivateTicketRule(Long id);
    List<TicketRuleResponse> getActiveTicketRules();
    List<TicketRuleResponse> getInactiveTicketRules();
}
