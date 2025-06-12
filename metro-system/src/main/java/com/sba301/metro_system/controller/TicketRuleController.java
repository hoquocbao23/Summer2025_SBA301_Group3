package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.ticketrule.TicketRuleRequest;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleListResponse;
import com.sba301.metro_system.dto.response.ticketrule.TicketRuleResponse;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.service.ITicketRuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ticket-rules")
@RequiredArgsConstructor
@Tag(name = "Ticket Rule Management", description = "APIs for managing ticket pricing rules")
public class TicketRuleController {

    private final ITicketRuleService ticketRuleService;

    @PostMapping
    @Operation(summary = "Create a new ticket rule", description = "Create a new ticket pricing rule")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Ticket rule created successfully",
                    content = @Content(schema = @Schema(implementation = TicketRuleResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or rule name already exists"
            )
    })
    public ResponseApi<TicketRuleResponse> createTicketRule(
            @Valid @RequestBody TicketRuleRequest request) {
        TicketRuleResponse response = ticketRuleService.createTicketRule(request);
        return ResponseApi.<TicketRuleResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Ticket rule created successfully")
                .data(response)
                .build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a ticket rule", description = "Update an existing ticket rule")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rule updated successfully",
                    content = @Content(schema = @Schema(implementation = TicketRuleResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            )
    })
    public ResponseApi<TicketRuleResponse> updateTicketRule(
            @Parameter(description = "Ticket Rule ID") @PathVariable Long id,
            @Valid @RequestBody TicketRuleRequest request) {
        TicketRuleResponse response = ticketRuleService.updateTicketRule(request, id);
        return ResponseApi.<TicketRuleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rule updated successfully")
                .data(response)
                .build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a ticket rule", description = "Soft delete a ticket rule")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rule deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<?> deleteTicketRule(
            @Parameter(description = "Ticket Rule ID") @PathVariable Long id) {
        ticketRuleService.deleteTicketRule(id);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rule deleted successfully")
                .build();
    }

    @GetMapping
    @Operation(summary = "Get all ticket rules", description = "Retrieve all active ticket rules")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rules retrieved successfully",
                    content = @Content(schema = @Schema(implementation = TicketRuleListResponse.class))
            )
    })
    public ResponseApi<TicketRuleListResponse> getAllTicketRules() {
        TicketRuleListResponse response = ticketRuleService.getAllTicketRules();
        return ResponseApi.<TicketRuleListResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rules retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search ticket rules by name", description = "Search ticket rules by name keyword")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rules found successfully"
            )
    })
    public ResponseApi<List<TicketRuleResponse>> searchTicketRules(
            @Parameter(description = "Search keyword") @RequestParam String keyword) {
        List<TicketRuleResponse> response = ticketRuleService.searchTicketRulesByName(keyword);
        return ResponseApi.<List<TicketRuleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rules found successfully")
                .data(response)
                .build();
    }

    @GetMapping("/by-status/{status}")
    @Operation(summary = "Get ticket rules by status", description = "Retrieve ticket rules by status")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rules retrieved successfully"
            )
    })
    public ResponseApi<List<TicketRuleResponse>> getTicketRulesByStatus(
            @Parameter(description = "Status (ACTIVE/INACTIVE)") @PathVariable Status status) {
        List<TicketRuleResponse> response = ticketRuleService.getTicketRulesByStatus(status);
        return ResponseApi.<List<TicketRuleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rules retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/by-name/{ruleName}")
    @Operation(summary = "Get ticket rule by name", description = "Retrieve a ticket rule by its name")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rule retrieved successfully",
                    content = @Content(schema = @Schema(implementation = TicketRuleResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<TicketRuleResponse> getTicketRuleByName(
            @Parameter(description = "Rule name") @PathVariable String ruleName) {
        TicketRuleResponse response = ticketRuleService.getTicketRuleByName(ruleName);
        return ResponseApi.<TicketRuleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rule retrieved successfully")
                .data(response)
                .build();
    }

//    @GetMapping("/{id}/calculate-price")
//    @Operation(summary = "Calculate total price", description = "Calculate total price for a given distance using specific rule")
//    @ApiResponses({
//            @ApiResponse(
//                    responseCode = "200",
//                    description = "Price calculated successfully"
//            ),
//            @ApiResponse(
//                    responseCode = "404",
//                    description = "Ticket rule not found"
//            ),
//            @ApiResponse(
//                    responseCode = "400",
//                    description = "Invalid distance or inactive rule"
//            )
//    })
//    public ResponseApi<Double> calculateTotalPrice(
//            @Parameter(description = "Ticket Rule ID") @PathVariable Long id,
//            @Parameter(description = "Distance in kilometers") @RequestParam Double distance) {
//        Double totalPrice = ticketRuleService.calculateTotalPrice(id, distance);
//        return ResponseApi.<Double>builder()
//                .status(HttpStatus.OK.value())
//                .message("Price calculated successfully")
//                .data(totalPrice)
//                .build();
//    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate ticket rule", description = "Set ticket rule status to ACTIVE")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rule activated successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<?> activateTicketRule(
            @Parameter(description = "Ticket Rule ID") @PathVariable Long id) {
        ticketRuleService.activateTicketRule(id);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rule activated successfully")
                .build();
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate ticket rule", description = "Set ticket rule status to INACTIVE")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ticket rule deactivated successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<?> deactivateTicketRule(
            @Parameter(description = "Ticket Rule ID") @PathVariable Long id) {
        ticketRuleService.deactivateTicketRule(id);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket rule deactivated successfully")
                .build();
    }

    @GetMapping("/active")
    @Operation(summary = "Get active ticket rules", description = "Retrieve all active ticket rules")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Active ticket rules retrieved successfully"
            )
    })
    public ResponseApi<List<TicketRuleResponse>> getActiveTicketRules() {
        List<TicketRuleResponse> response = ticketRuleService.getActiveTicketRules();
        return ResponseApi.<List<TicketRuleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Active ticket rules retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/inactive")
    @Operation(summary = "Get inactive ticket rules", description = "Retrieve all inactive ticket rules")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Inactive ticket rules retrieved successfully"
            )
    })
    public ResponseApi<List<TicketRuleResponse>> getInactiveTicketRules() {
        List<TicketRuleResponse> response = ticketRuleService.getInactiveTicketRules();
        return ResponseApi.<List<TicketRuleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Inactive ticket rules retrieved successfully")
                .data(response)
                .build();
    }
}
