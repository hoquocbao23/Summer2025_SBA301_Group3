package com.sba301.metro_system.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class StationInRouteResponse {
    private Long stationId;
    private String stationName;
    private String stationLocation;
    private Integer stationOrder;
    private Double distanceToNext;
}
