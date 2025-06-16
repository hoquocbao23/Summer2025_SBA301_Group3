package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.request.route.RouteStationRequest;
import com.sba301.metro_system.dto.response.route.RouteListResponse;
import com.sba301.metro_system.dto.response.route.RouteResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IRouteService {
    
    // Basic Route CRUD operations
    RouteResponse createRoute(RouteRequest routeRequest);
    void updateRoute(RouteRequest routeRequest, String routeId);
    void deactivateRoute(String routeId);
    void activateRoute(String routeId);
    RouteResponse getRoute(String routeId);
    RouteListResponse getAllRoutes();
    
    // Station Route operations
    RouteResponse createStationRoute(RouteStationRequest routeStationRequest);

    void updateStationRoute(RouteStationRequest routeStationRequest);
    void deleteStationRoute(String routeId);

    List<RouteResponse> getRoutesByTicketRule(Long ticketRuleId);
    RouteResponse getRouteByName(String routeName);
}
