package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.request.route.RouteStationRequest;
import com.sba301.metro_system.dto.response.route.RouteResponse;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.StationRoute;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RouteMapper {
    public Route toEntity(RouteRequest request) {
        if (request == null) {
            return null;
        }

        Route route = new Route();
        route.setRouteName(request.routeName());
        route.setRouteDescription(request.routeDescription());
        route.setEstimatedDuration(request.estimatedDuration());
        route.setFrequencyMinutes(request.frequencyMinutes());
        route.setTotalDistance(0.0); // Default value
        route.setDelete(false); // Default value
        
        return route;
    }

    public RouteResponse toResponse(Route route) {
        if (route == null) {
            return null;
        }

        return RouteResponse.builder()
                .routeId(route.getRouteId())
                .routeName(route.getRouteName())
                .routeDescription(route.getRouteDescription())
                .ticketRule(route.getTicketRule())
                .totalDistance(route.getTotalDistance())
                .estimatedDuration(route.getEstimatedDuration())
                .frequencyMinutes(route.getFrequencyMinutes())
                .build();
    }

    public RouteResponse toResponseWithStations(Route route, List<StationRoute> stationRoutes) {
        if (route == null) {
            return null;
        }

        List<RouteResponse.RouteStationResponse> stationResponses = null;
        if (stationRoutes != null) {
            stationResponses = stationRoutes.stream()
                    .map(this::toStationResponse)
                    .collect(Collectors.toList());
        }

        return RouteResponse.builder()
                .routeId(route.getRouteId())
                .routeName(route.getRouteName())
                .routeDescription(route.getRouteDescription())
                .ticketRule(route.getTicketRule())
                .totalDistance(route.getTotalDistance())
                .estimatedDuration(route.getEstimatedDuration())
                .frequencyMinutes(route.getFrequencyMinutes())
                .stations(stationResponses)
                .build();
    }

    private RouteResponse.RouteStationResponse toStationResponse(StationRoute stationRoute) {
        if (stationRoute == null || stationRoute.getStation() == null) {
            return null;
        }

        Station station = stationRoute.getStation();
        return RouteResponse.RouteStationResponse.builder()
                .stationId(station.getStationId())
                .stationOrder(stationRoute.getStationOrder())
                .distanceToNext(stationRoute.getDistanceToNext())
                .stationName(station.getStationName())
                .stationLocation(station.getStationLocation())
                .build();
    }

    public StationRoute toStationRouteEntity(RouteStationRequest.StationRoute stationRequest, Route route, Station station) {
        if (stationRequest == null) {
            return null;
        }

        StationRoute stationRoute = new StationRoute();
        stationRoute.setRoute(route);
        stationRoute.setStation(station);
        stationRoute.setStationOrder(stationRequest.stationOrder());
        stationRoute.setDistanceToNext(stationRequest.distanceToNext());
        
        return stationRoute;
    }

    public void updateEntity(Route route, RouteRequest request) {
        if (route == null || request == null) {
            return;
        }

        if (request.routeName() != null) {
            route.setRouteName(request.routeName());
        }
        if (request.routeDescription() != null) {
            route.setRouteDescription(request.routeDescription());
        }
        if (request.estimatedDuration() != null) {
            route.setEstimatedDuration(request.estimatedDuration());
        }
        if (request.frequencyMinutes() != null) {
            route.setFrequencyMinutes(request.frequencyMinutes());
        }
    }

    public List<RouteResponse> toResponseList(List<Route> routes) {
        if (routes == null) {
            return null;
        }

        return routes.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RouteResponse.RouteStationResponse> toStationResponseList(List<StationRoute> stationRoutes) {
        if (stationRoutes == null) {
            return null;
        }

        return stationRoutes.stream()
                .map(this::toStationResponse)
                .collect(Collectors.toList());
    }
}
