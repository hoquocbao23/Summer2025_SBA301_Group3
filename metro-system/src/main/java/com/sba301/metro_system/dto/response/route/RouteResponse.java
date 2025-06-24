package com.sba301.metro_system.dto.response.route;

import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.TicketRule;
import com.sba301.metro_system.enums.Status;
import lombok.Builder;

import java.util.List;

@Builder
public record RouteResponse(
        Long routeId,
        String routeName,
        String routeDescription,
        TicketRule ticketRule,
        Double totalDistance,
        Integer estimatedDuration,
        Integer frequencyMinutes,
        String operatingHours,
        String color,
        Status status,
        List<RouteStationResponse> stations
) {
    @Builder
    public record RouteStationResponse(
            Long stationId,
            Integer stationOrder,
            Double distanceToNext,
            String stationName,
            String stationLocation
    ) {

    }
}
