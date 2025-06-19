package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.response.RouteSearchResponse;

public interface RouteSearchService {
    RouteSearchResponse findRoutesBetweenStations(RouteSearchRequest request);
}
