package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.response.RouteSearchResponse;
import com.sba301.metro_system.service.RouteSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Route Search", description = "API for searching routes between stations")
public class RouteSearchController {

    private final RouteSearchService routeSearchService;    @PostMapping("/search")
    @Operation(summary = "Find routes between two stations", 
               description = "Find all available routes between source and destination stations, sorted by price ascending")
    public ResponseEntity<ResponseApi<RouteSearchResponse>> searchRoutes(
            @Valid @RequestBody RouteSearchRequest request) {
        
        RouteSearchResponse response = routeSearchService.findRoutesBetweenStations(request);
        
        return ResponseEntity.ok(ResponseApi.<RouteSearchResponse>builder()
                .status(200)
                .message("Routes found successfully")
                .data(response)
                .build());
    }    @GetMapping("/search")
    @Operation(summary = "Find routes between two stations (GET)", 
               description = "Find all available routes between source and destination stations using query parameters")
    public ResponseEntity<ResponseApi<RouteSearchResponse>> searchRoutesWithParams(
            @RequestParam("sourceStationId") Long sourceStationId,
            @RequestParam("destinationStationId") Long destinationStationId) {
        
        RouteSearchRequest request = new RouteSearchRequest();
        request.setSourceStationId(sourceStationId);
        request.setDestinationStationId(destinationStationId);
        
        RouteSearchResponse response = routeSearchService.findRoutesBetweenStations(request);
        
        return ResponseEntity.ok(ResponseApi.<RouteSearchResponse>builder()
                .status(200)
                .message("Routes found successfully")
                .data(response)
                .build());
    }
}
