package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.ticketrule.TicketRuleRequest;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleListResponse;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleResponse;
import com.sba301.metro_system.entity.TicketRule;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.mapper.TicketRuleMapper;
import com.sba301.metro_system.repository.TicketRuleRepository;
import com.sba301.metro_system.service.ITicketRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketRuleService implements ITicketRuleService {
    private final TicketRuleRepository ticketRuleRepository;
    private final TicketRuleMapper ticketRuleMapper;

//    @Override
//    @Transactional(readOnly = true)
//    public TicketRuleResponse getTicketRule(Long id) {
//        TicketRule ticketRule = ticketRuleRepository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + id));
//
//        if (ticketRule.isDelete()) {
//            throw new NotFoundException("Ticket rule has been deleted");
//        }
//
//        return ticketRuleMapper.toTicketRuleResponse(ticketRule);
//    }

    @Override
    @Transactional(readOnly = true)
    public TicketRuleListResponse getAllTicketRules() {
        List<TicketRule> ticketRules = ticketRuleRepository.findByIsDeleteFalse();
        return ticketRuleMapper.toListResponse(ticketRules, "All ticket rules retrieved successfully");
    }

    @Override
    @Transactional
    public TicketRuleResponse createTicketRule(TicketRuleRequest request) {
        // Validate if rule name already exists
        if (ticketRuleRepository.existsByRuleName(request.ruleName())) {
            throw new IllegalArgumentException("Ticket rule name already exists: " + request.ruleName());
        }

        // Create ticket rule using mapper
        TicketRule ticketRule = ticketRuleMapper.toNewEntity(request);
        
        // Save ticket rule
        TicketRule savedTicketRule = ticketRuleRepository.save(ticketRule);
        
        return ticketRuleMapper.toTicketRuleResponse(savedTicketRule);
    }

    @Override
    @Transactional
    public TicketRuleResponse updateTicketRule(TicketRuleRequest request, Long id) {
        // Find existing ticket rule
        TicketRule existingTicketRule = ticketRuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + id));
        
        // Check if ticket rule is not deleted
        if (existingTicketRule.isDelete()) {
            throw new IllegalStateException("Cannot update deleted ticket rule");
        }
        
        // Validate rule name uniqueness (exclude current rule)
        if (request.ruleName() != null && 
            !request.ruleName().equals(existingTicketRule.getRuleName()) &&
            ticketRuleRepository.existsByRuleNameAndRuleIdNot(request.ruleName(), id)) {
            throw new IllegalArgumentException("Ticket rule name already exists: " + request.ruleName());
        }
        
        // Update ticket rule using mapper
        ticketRuleMapper.updateEntity(existingTicketRule, request);
        
        // Save updated ticket rule
        TicketRule updatedTicketRule = ticketRuleRepository.save(existingTicketRule);
        
        return ticketRuleMapper.toTicketRuleResponse(updatedTicketRule);
    }

//    @Override
//    @Transactional
//    public void deleteTicketRule(Long id) {
//        TicketRule ticketRule = ticketRuleRepository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + id));
//
//        // Soft delete
//        ticketRule.setStatus(Status.INACTIVE);
//        ticketRuleRepository.save(ticketRule);
//    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketRuleResponse> searchTicketRulesByName(String keyword) {
        List<TicketRule> ticketRules = ticketRuleRepository.findByRuleNameContaining(keyword);
        return ticketRuleMapper.toResponseList(ticketRules);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketRuleResponse> getTicketRulesByStatus(Status status) {
        List<TicketRule> ticketRules = ticketRuleRepository.findByStatusAndIsDeleteFalse(status);
        return ticketRuleMapper.toResponseList(ticketRules);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketRuleResponse getTicketRuleByName(String ruleName) {
        TicketRule ticketRule = ticketRuleRepository.findByRuleName(ruleName)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with name: " + ruleName));
        
        if (ticketRule.isDelete()) {
            throw new NotFoundException("Ticket rule has been deleted");
        }
        
        return ticketRuleMapper.toTicketRuleResponse(ticketRule);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalPrice(Long ruleId, Double distance) {
        TicketRule ticketRule = ticketRuleRepository.findById(ruleId)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + ruleId));
        
        if (ticketRule.isDelete()) {
            throw new IllegalStateException("Cannot calculate price with deleted ticket rule");
        }
        
        if (ticketRule.getStatus() != Status.ACTIVE) {
            throw new IllegalStateException("Cannot calculate price with inactive ticket rule");
        }
        
        if (distance == null || distance < 0) {
            throw new IllegalArgumentException("Distance must be non-negative");
        }
        
        return ticketRule.getBasePrice() + (ticketRule.getPricePerKm() * distance);
    }

    @Override
    @Transactional
    public void activateTicketRule(Long id) {
        TicketRule ticketRule = ticketRuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + id));
        
        if (ticketRule.isDelete()) {
            throw new IllegalStateException("Cannot activate deleted ticket rule");
        }
        
        ticketRule.setStatus(Status.ACTIVE);
        ticketRuleRepository.save(ticketRule);
    }

    @Override
    @Transactional
    public void deactivateTicketRule(Long id) {
        TicketRule ticketRule = ticketRuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + id));
        
        if (ticketRule.isDelete()) {
            throw new IllegalStateException("Cannot deactivate deleted ticket rule");
        }
        
        ticketRule.setStatus(Status.INACTIVE);
        ticketRuleRepository.save(ticketRule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketRuleResponse> getActiveTicketRules() {
        return getTicketRulesByStatus(Status.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketRuleResponse> getInactiveTicketRules() {
        return getTicketRulesByStatus(Status.INACTIVE);
    }
}
