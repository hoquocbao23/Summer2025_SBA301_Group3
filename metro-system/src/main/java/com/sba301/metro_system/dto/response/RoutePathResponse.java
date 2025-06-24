package com.sba301.metro_system.dto.response;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RoutePathResponse {
    private Long routeId;
    private String routeName;
    private String routeDescription;
    private String color;
    private Double totalDistance;
    private Integer estimatedDuration;
    private BigDecimal totalPrice;
    private List<StationInRouteResponse> stations;
}
