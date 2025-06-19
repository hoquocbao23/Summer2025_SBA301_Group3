package com.sba301.metro_system.dto.response;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RouteSearchResponse {
    private Long sourceStationId;
    private String sourceStationName;
    private Long destinationStationId;
    private String destinationStationName;
    private List<RoutePathResponse> availableRoutes;
    private Integer totalRoutesFound;
}
