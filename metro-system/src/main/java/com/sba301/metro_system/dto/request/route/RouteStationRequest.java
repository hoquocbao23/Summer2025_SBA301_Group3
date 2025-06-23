package com.sba301.metro_system.dto.request.route;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;

@Builder
public record RouteStationRequest(
        @Schema(description = "Route ID", example = "1")
        @NotNull(message = "Route ID is required")
        @Positive(message = "Route ID must be positive")
        Long routeId,
        
        @Schema(description = "List of stations with their order and distances")
        @NotNull(message = "Stations list is required")
        @NotEmpty(message = "At least one station is required")
        @Valid
        List<StationRoute> stations
) {
    @Builder
    public record StationRoute(
            @Schema(description = "Station ID", example = "1")
            @NotNull(message = "Station ID is required")
            @Positive(message = "Station ID must be positive")
            Long stationId,
            
            @Schema(description = "Order of station in the route", example = "1")
            @NotNull(message = "Station order is required")
            @Min(value = 1, message = "Station order must be at least 1")
            Integer stationOrder,
            
            @Schema(description = "Distance to next station in kilometers", example = "1.5")
            @DecimalMin(value = "0.0", message = "Distance must be non-negative")
            @DecimalMax(value = "50.0", message = "Distance must not exceed 50 km")
            Double distanceToNext
    ) {
    }
}
