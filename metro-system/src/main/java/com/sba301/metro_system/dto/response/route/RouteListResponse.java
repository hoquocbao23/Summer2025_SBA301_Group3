package com.sba301.metro_system.dto.response.route;

import lombok.Builder;

import java.util.List;

@Builder
public record RouteListResponse(
        List<RouteResponse> routes,
        Integer totalCount
) {
}
