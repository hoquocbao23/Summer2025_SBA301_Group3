package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.request.route.RouteStationRequest;
import com.sba301.metro_system.dto.response.route.RouteListResponse;
import com.sba301.metro_system.dto.response.route.RouteResponse;
import com.sba301.metro_system.service.IRouteService;
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
@RequestMapping("/routes")
@RequiredArgsConstructor
@Tag(name = "Route Management", description = "APIs for managing metro routes")
public class RouteController {

    private final IRouteService routeService;

    @PostMapping
    @Operation(summary = "Create a new route", description = "Create a new metro route with basic information")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Route created successfully",
                    content = @Content(schema = @Schema(implementation = RouteResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<RouteResponse> createRoute(
            @Valid @RequestBody RouteRequest routeRequest) {
        RouteResponse response = routeService.createRoute(routeRequest);
        return ResponseApi.<RouteResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Route created successfully")
                .data(response)
                .build();
    }

    @PutMapping("/{routeId}")
    @Operation(summary = "Update a route", description = "Update an existing metro route")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Route updated successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route not found"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            )
    })
    public ResponseApi<?> updateRoute(
            @Parameter(description = "Route ID") @PathVariable String routeId,
            @Valid @RequestBody RouteRequest routeRequest) {
        routeService.updateRoute(routeRequest, routeId);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Route updated successfully")
                .build();
    }

    @DeleteMapping("/{routeId}")
    @Operation(summary = "Delete a route", description = "Soft delete a metro route")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Route deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route not found"
            )
    })
    public ResponseApi<?> deleteRoute(
            @Parameter(description = "Route ID") @PathVariable String routeId) {
        routeService.deleteRoute(routeId);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Route deleted successfully")
                .build();
    }

    @GetMapping("/{routeId}")
    @Operation(summary = "Get route by ID", description = "Retrieve a specific route with its stations")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Route retrieved successfully",
                    content = @Content(schema = @Schema(implementation = RouteResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route not found"
            )
    })
    public ResponseApi<RouteResponse> getRoute(
            @Parameter(description = "Route ID") @PathVariable String routeId) {
        RouteResponse response = routeService.getRoute(routeId);
        return ResponseApi.<RouteResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Route retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping
    @Operation(summary = "Get all routes", description = "Retrieve all active metro routes")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Routes retrieved successfully"
            )
    })
    public ResponseApi<RouteListResponse> getAllRoutes() {
        RouteListResponse response = routeService.getAllRoutes();
        return ResponseApi.<RouteListResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Routes retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/by-ticket-rule/{ticketRuleId}")
    @Operation(summary = "Get routes by ticket rule", description = "Retrieve routes by ticket rule ID")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Routes retrieved successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Ticket rule not found"
            )
    })
    public ResponseApi<List<RouteResponse>> getRoutesByTicketRule(
            @Parameter(description = "Ticket Rule ID") @PathVariable Long ticketRuleId) {
        List<RouteResponse> response = routeService.getRoutesByTicketRule(ticketRuleId);
        return ResponseApi.<List<RouteResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Routes retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/by-name/{routeName}")
    @Operation(summary = "Get route by name", description = "Retrieve a route by its name")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Route retrieved successfully",
                    content = @Content(schema = @Schema(implementation = RouteResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route not found"
            )
    })
    public ResponseApi<RouteResponse> getRouteByName(
            @Parameter(description = "Route name") @PathVariable String routeName) {
        RouteResponse response = routeService.getRouteByName(routeName);
        return ResponseApi.<RouteResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Route retrieved successfully")
                .data(response)
                .build();
    }

    // Station Route Management Endpoints
    @PostMapping("/stations")
    @Operation(summary = "Add stations to route", description = "Add multiple stations to a route with their order and distances")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Stations added to route successfully",
                    content = @Content(schema = @Schema(implementation = RouteResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route or station not found"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Station already exists in route or invalid data"
            )
    })
    public ResponseApi<RouteResponse> createStationRoute(
            @Valid @RequestBody RouteStationRequest routeStationRequest) {
        RouteResponse response = routeService.createStationRoute(routeStationRequest);
        return ResponseApi.<RouteResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Stations added to route successfully")
                .data(response)
                .build();
    }

    @PutMapping("/stations")
    @Operation(summary = "Update route stations", description = "Update all stations for a route (replaces existing stations)")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Route stations updated successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route or station not found"
            )
    })
    public ResponseApi<?> updateStationRoute(
            @Valid @RequestBody RouteStationRequest routeStationRequest) {
        routeService.updateStationRoute(routeStationRequest);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Route stations updated successfully")
                .build();
    }

    @DeleteMapping("/{routeId}/stations")
    @Operation(summary = "Remove all stations from route", description = "Remove all stations from a specific route")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "All stations removed from route successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Route not found"
            )
    })
    public ResponseApi<?> deleteStationRoute(
            @Parameter(description = "Route ID") @PathVariable String routeId) {
        routeService.deleteStationRoute(routeId);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("All stations removed from route successfully")
                .build();
    }
}
