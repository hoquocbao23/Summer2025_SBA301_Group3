package com.sba301.metro_system.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StationInPathResponse {
    private Long stationId;
    private String stationName;
    private String stationLocation;
    private Integer order;
}
