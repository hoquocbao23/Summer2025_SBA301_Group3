package com.sba301.metro_system.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PathResponse {
    private List<RouteInPathResponse> routes;
    private Double totalDistance;
}
