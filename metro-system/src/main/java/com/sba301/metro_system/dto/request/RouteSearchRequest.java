package com.sba301.metro_system.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RouteSearchRequest {
    @NotNull(message = "Source station ID is required")
    private Long sourceStationId;
    
    @NotNull(message = "Destination station ID is required")
    private Long destinationStationId;
}
