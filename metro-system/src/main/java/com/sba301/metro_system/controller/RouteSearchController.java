package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.request.route.PathDTO;
import com.sba301.metro_system.dto.response.PathSearchResponse;
import com.sba301.metro_system.dto.response.RouteSearchResponse;
import com.sba301.metro_system.service.IRouteSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
@Tag(name = "Route Search", description = "API for searching routes between stations")
public class RouteSearchController {

    private final IRouteSearchService routeSearchService;

    @GetMapping("/shortest")
    @Operation(summary = "Find path between two stations using algorithm",
            description = "Find all available path between source and destination stations using query parameters")
    public ResponseEntity<ResponseApi<List<PathDTO>>> getKShortest(
            @RequestParam Long source,
            @RequestParam Long dest,
            @RequestParam(defaultValue = "3") int k) {
        return ResponseEntity.ok(
                ResponseApi.<List<PathDTO>>builder()
                        .status(200)
                        .message("Paths found successfully")
                        .data(routeSearchService.findKShortestPaths(source, dest, k))
                        .build()
        );
    }

    @GetMapping("/search")
    @Operation(summary = "Find detailed paths with routes between two stations",
            description = "Find k shortest paths with detailed route and station information")
    public ResponseEntity<ResponseApi<PathSearchResponse>> searchPaths(
            @RequestParam Long source,
            @RequestParam Long dest,
            @RequestParam(defaultValue = "3") int k) {
        
        PathSearchResponse response = routeSearchService.findKShortestPathsWithRoutes(source, dest, k);
        
        return ResponseEntity.ok(
                ResponseApi.<PathSearchResponse>builder()
                        .status(200)
                        .message("Paths with route details found successfully")
                        .data(response)
                        .build()
        );
    }
}
