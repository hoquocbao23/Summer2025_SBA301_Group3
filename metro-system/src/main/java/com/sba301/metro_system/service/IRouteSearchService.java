package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.request.route.PathDTO;
import com.sba301.metro_system.dto.response.PathSearchResponse;
import com.sba301.metro_system.dto.response.RouteSearchResponse;

import java.util.List;

public interface IRouteSearchService {
//    RouteSearchResponse findRoutesBetweenStations(RouteSearchRequest request);
    List<PathDTO> findKShortestPaths(Long source, Long dest, int k);
    PathSearchResponse findKShortestPathsWithRoutes(Long source, Long dest, int k);
    void buildGraph();
}
