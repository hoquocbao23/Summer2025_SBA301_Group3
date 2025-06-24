package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.response.RoutePathResponse;
import com.sba301.metro_system.dto.response.RouteSearchResponse;
import com.sba301.metro_system.dto.response.StationInRouteResponse;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.StationRoute;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.repository.StationRouteRepository;
import com.sba301.metro_system.service.RouteSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteSearchServiceImpl implements RouteSearchService {

    private final StationRouteRepository stationRouteRepository;
    private final StationRepository stationRepository;

    @Override
    public RouteSearchResponse findRoutesBetweenStations(RouteSearchRequest request) {
        log.info("Finding routes between station {} and station {}", 
                request.getSourceStationId(), request.getDestinationStationId());

        // Validate stations exist
        Station sourceStation = stationRepository.findById(request.getSourceStationId())
                .orElseThrow(() -> new NotFoundException("Source station not found"));
        
        Station destinationStation = stationRepository.findById(request.getDestinationStationId())
                .orElseThrow(() -> new NotFoundException("Destination station not found"));

        // Find all routes that connect both stations
        List<Route> connectingRoutes = stationRouteRepository
                .findRoutesBetweenStations(request.getSourceStationId(), request.getDestinationStationId());

        if (connectingRoutes.isEmpty()) {
            log.info("No direct routes found between stations {} and {}", 
                    sourceStation.getStationName(), destinationStation.getStationName());
        }

        // Build route path responses with price calculation
        List<RoutePathResponse> routePaths = connectingRoutes.stream()
                .map(route -> buildRoutePathResponse(route, request.getSourceStationId(), request.getDestinationStationId()))
                .filter(routePath -> routePath != null) // Filter out invalid routes
                .sorted(Comparator.comparing(RoutePathResponse::getTotalPrice)) // Sort by price ascending
                .collect(Collectors.toList());

        return RouteSearchResponse.builder()
                .sourceStationId(sourceStation.getStationId())
                .sourceStationName(sourceStation.getStationName())
                .destinationStationId(destinationStation.getStationId())
                .destinationStationName(destinationStation.getStationName())
                .availableRoutes(routePaths)
                .totalRoutesFound(routePaths.size())
                .build();
    }

    private RoutePathResponse buildRoutePathResponse(Route route, Long sourceStationId, Long destinationStationId) {
        try {
            // Get station information in the route
            List<StationRoute> stationInfo = stationRouteRepository
                    .findStationInfoInRoute(route, sourceStationId, destinationStationId);

            if (stationInfo.size() != 2) {
                log.warn("Invalid station information for route {}", route.getRouteId());
                return null;
            }

            StationRoute sourceStationRoute = stationInfo.get(0);
            StationRoute destinationStationRoute = stationInfo.get(1);

            // Ensure source comes before destination in the route
            if (sourceStationRoute.getStationOrder() > destinationStationRoute.getStationOrder()) {
                StationRoute temp = sourceStationRoute;
                sourceStationRoute = destinationStationRoute;
                destinationStationRoute = temp;
            }

            // Get all stations between source and destination (inclusive)
            List<StationRoute> routeStations = stationRouteRepository
                    .findByRouteAndStationOrderBetween(route, 
                            sourceStationRoute.getStationOrder(), 
                            destinationStationRoute.getStationOrder());

            // Calculate total distance and price
            double totalDistance = calculateTotalDistance(routeStations);
            BigDecimal totalPrice = calculateTotalPrice(route, totalDistance);

            // Build station list
            List<StationInRouteResponse> stations = routeStations.stream()
                    .map(sr -> StationInRouteResponse.builder()
                            .stationId(sr.getStation().getStationId())
                            .stationName(sr.getStation().getStationName())
                            .stationLocation(sr.getStation().getStationLocation())
                            .stationOrder(sr.getStationOrder())
                            .distanceToNext(sr.getDistanceToNext())
                            .build())
                    .collect(Collectors.toList());

            return RoutePathResponse.builder()
                    .routeId(route.getRouteId())
                    .routeName(route.getRouteName())
                    .routeDescription(route.getRouteDescription())
                    .color(route.getColor())
                    .totalDistance(totalDistance)
                    .estimatedDuration(route.getEstimatedDuration())
                    .totalPrice(totalPrice)
                    .stations(stations)
                    .build();

        } catch (Exception e) {
            log.error("Error building route path response for route {}: {}", route.getRouteId(), e.getMessage());
            return null;
        }
    }

    private double calculateTotalDistance(List<StationRoute> routeStations) {
        double totalDistance = 0.0;
        
        // Sum up distances from source to destination (excluding the last station's distanceToNext)
        for (int i = 0; i < routeStations.size() - 1; i++) {
            StationRoute station = routeStations.get(i);
            if (station.getDistanceToNext() != null) {
                totalDistance += station.getDistanceToNext();
            }
        }
        
        return totalDistance;
    }

    private BigDecimal calculateTotalPrice(Route route, double totalDistance) {
        if (route.getTicketRule() == null) {
            log.warn("No ticket rule found for route {}", route.getRouteId());
            return BigDecimal.ZERO;
        }

        double basePrice = route.getTicketRule().getBasePrice() != null ? 
                route.getTicketRule().getBasePrice() : 0.0;
        double pricePerKm = route.getTicketRule().getPricePerKm() != null ? 
                route.getTicketRule().getPricePerKm() : 0.0;

        double totalPriceValue = basePrice + (totalDistance * pricePerKm);
        
        return BigDecimal.valueOf(totalPriceValue).setScale(2, RoundingMode.HALF_UP);
    }
}
