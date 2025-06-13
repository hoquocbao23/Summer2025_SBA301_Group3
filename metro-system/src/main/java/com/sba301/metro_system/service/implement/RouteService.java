package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.request.route.RouteStationRequest;
import com.sba301.metro_system.dto.response.route.RouteResponse;
import com.sba301.metro_system.dto.response.route.RouteListResponse;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.StationRoute;
import com.sba301.metro_system.entity.TicketRule;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.mapper.RouteMapper;
import com.sba301.metro_system.repository.RouteRepository;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.repository.StationRouteRepository;
import com.sba301.metro_system.repository.TicketRuleRepository;
import com.sba301.metro_system.service.IRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService implements IRouteService {

    private final RouteRepository routeRepository;
    private final TicketRuleRepository ticketRuleRepository;
    private final StationRepository stationRepository;
    private final StationRouteRepository stationRouteRepository;
    private final RouteMapper routeMapper;

    @Override
    @Transactional
    public RouteResponse createRoute(RouteRequest routeRequest) {
        // Validate if route name already exists
        if (routeRepository.existsByRouteName(routeRequest.routeName())) {
            throw new IllegalArgumentException("Route name already exists: " + routeRequest.routeName());
        }

        // Create route using mapper
        Route route = routeMapper.toEntity(routeRequest);

        // Set ticket rule
        TicketRule ticketRule = ticketRuleRepository.findById(routeRequest.ruleId())
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + routeRequest.ruleId()));
        route.setTicketRule(ticketRule);

        // Save route
        Route savedRoute = routeRepository.save(route);

        return routeMapper.toResponse(savedRoute);
    }

    @Override
    @Transactional
    public void updateRoute(RouteRequest routeRequest, String routeId) {
        Long id = Long.parseLong(routeId);
        
        // Find existing route
        Route existingRoute = routeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeId));

        
        // Validate route name uniqueness (exclude current route)
        if (routeRequest.routeName() != null && 
            !routeRequest.routeName().equals(existingRoute.getRouteName()) &&
            routeRepository.existsByRouteNameAndRouteIdNot(routeRequest.routeName(), id)) {
            throw new IllegalArgumentException("Route name already exists: " + routeRequest.routeName());
        }
        
        // Update ticket rule if provided
        if (routeRequest.ruleId() != null) {
            TicketRule ticketRule = ticketRuleRepository.findById(routeRequest.ruleId())
                    .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + routeRequest.ruleId()));
            existingRoute.setTicketRule(ticketRule);
        }
        
        // Update route using mapper
        routeMapper.updateEntity(existingRoute, routeRequest);
        
        // Recalculate total distance if needed
        recalculateTotalDistance(existingRoute);
        
        routeRepository.save(existingRoute);
    }

    @Override
    @Transactional
    public void deleteRoute(String routeId) {
        Long id = Long.parseLong(routeId);
        
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeId));
        
        // Soft delete
        route.setStatus(Status.INACTIVE);
        routeRepository.save(route);
    }

    @Override
    @Transactional(readOnly = true)
    public RouteResponse getRoute(String routeId) {
        Long id = Long.parseLong(routeId);
        
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeId));

        
        // Get station routes for this route
        List<StationRoute> stationRoutes = stationRouteRepository.findByRouteIdOrderByStationOrder(id);
        
        return routeMapper.toResponseWithStations(route, stationRoutes);
    }

    @Override
    @Transactional(readOnly = true)
    public RouteListResponse getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        
        List<RouteResponse> routeResponses = routes.stream()
                .map(route -> {
                    List<StationRoute> stationRoutes = stationRouteRepository.findByRouteOrderByStationOrder(route);
                    return routeMapper.toResponseWithStations(route, stationRoutes);
                })
                .collect(Collectors.toList());
        
        return RouteListResponse.builder()
                .routes(routeResponses)
                .totalCount(routeResponses.size())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByTicketRule(Long ticketRuleId) {
        TicketRule ticketRule = ticketRuleRepository.findById(ticketRuleId)
                .orElseThrow(() -> new NotFoundException("Ticket rule not found with ID: " + ticketRuleId));
        
        List<Route> routes = routeRepository.findByTicketRule(ticketRule);
        
        return routes.stream()
                .map(route -> {
                    List<StationRoute> stationRoutes = stationRouteRepository.findByRouteOrderByStationOrder(route);
                    return routeMapper.toResponseWithStations(route, stationRoutes);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public RouteResponse getRouteByName(String routeName) {
        Route route = routeRepository.findByRouteName(routeName)
                .orElseThrow(() -> new NotFoundException("Route not found with name: " + routeName));

        
        List<StationRoute> stationRoutes = stationRouteRepository.findByRouteOrderByStationOrder(route);
        return routeMapper.toResponseWithStations(route, stationRoutes);
    }
    
    /**
     * Helper method to recalculate total distance for a route
     */
    private void recalculateTotalDistance(Route route) {
        List<StationRoute> stationRoutes = stationRouteRepository.findByRouteOrderByStationOrder(route);
        
        double totalDistance = stationRoutes.stream()
                .filter(sr -> sr.getDistanceToNext() != null)
                .mapToDouble(StationRoute::getDistanceToNext)
                .sum();
        
        route.setTotalDistance(totalDistance);
    }

    @Transactional
    @Override
    public RouteResponse createStationRoute(RouteStationRequest routeStationRequest) {
        // Find the route
        Route route = routeRepository.findById(routeStationRequest.routeId())
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeStationRequest.routeId()));

        // Process each station in the request
        for (RouteStationRequest.StationRoute stationRequest : routeStationRequest.stations()) {
            // Find the station
            Station station = stationRepository.findById(stationRequest.stationId())
                    .orElseThrow(() -> new NotFoundException("Station not found with ID: " + stationRequest.stationId()));

            // Check if station route already exists
            if (stationRouteRepository.existsByRouteAndStation(route, station)) {
                throw new IllegalArgumentException("Station is already part of this route: " + station.getStationName());
            }

            // Create station route
            StationRoute stationRoute = routeMapper.toStationRouteEntity(stationRequest, route, station);
            stationRouteRepository.save(stationRoute);
        }

        // Recalculate total distance
        recalculateTotalDistance(route);
        routeRepository.save(route);

        // Return updated route with stations
        List<StationRoute> stationRoutes = stationRouteRepository.findByRouteOrderByStationOrder(route);
        return routeMapper.toResponseWithStations(route, stationRoutes);
    }

    @Override
    @Transactional
    public void updateStationRoute(RouteStationRequest routeStationRequest) {
        // Find the route
        Route route = routeRepository.findById(routeStationRequest.routeId())
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeStationRequest.routeId()));
        
        // Delete existing station routes for this route
        stationRouteRepository.deleteByRoute(route);
        
        // Add new station routes
        for (RouteStationRequest.StationRoute stationRequest : routeStationRequest.stations()) {
            Station station = stationRepository.findById(stationRequest.stationId())
                    .orElseThrow(() -> new NotFoundException("Station not found with ID: " + stationRequest.stationId()));
            
            StationRoute stationRoute = routeMapper.toStationRouteEntity(stationRequest, route, station);
            stationRouteRepository.save(stationRoute);
        }
        
        // Recalculate total distance
        recalculateTotalDistance(route);
        routeRepository.save(route);
    }

    @Override
    @Transactional
    public void deleteStationRoute(String routeId) {
        Long id = Long.parseLong(routeId);
        
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Route not found with ID: " + routeId));
        
        // Delete all station routes for this route
        stationRouteRepository.deleteByRoute(route);
        
        // Reset total distance
        route.setTotalDistance(0.0);
        routeRepository.save(route);
    }

}
