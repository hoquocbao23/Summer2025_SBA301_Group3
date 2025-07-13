package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.RouteSearchRequest;
import com.sba301.metro_system.dto.request.route.PathDTO;
import com.sba301.metro_system.dto.response.*;
import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.StationRoute;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.StationRepository;
import com.sba301.metro_system.repository.StationRouteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteSearchService implements com.sba301.metro_system.service.IRouteSearchService {

    private final StationRouteRepository stationRouteRepository;
    private final StationRepository stationRepository;

    // Optimized data structures
    private Map<Long, List<Edge>> graph;
    private Map<Long, Station> stationCache;
    private Map<String, Route> routeConnectionCache; // Cache for route connections between stations
    private Map<Long, List<StationRoute>> stationRouteCache; // Cache station routes

    @PostConstruct
    public void initGraph() {
        buildCaches();
        buildGraph();
    }

    /**
     * Build caches for faster lookups
     */
    private void buildCaches() {
        log.info("Building caches for faster lookups");

        // Initialize all cache maps first
        stationCache = new ConcurrentHashMap<>();
        stationRouteCache = new ConcurrentHashMap<>();
        routeConnectionCache = new ConcurrentHashMap<>();

        // Build station cache
        stationRepository.findAll().forEach(station ->
                stationCache.put(station.getStationId(), station));

        // Build station route cache
        List<StationRoute> allStationRoutes = stationRouteRepository.findAll();
        for (StationRoute sr : allStationRoutes) {
            stationRouteCache.computeIfAbsent(sr.getStation().getStationId(),
                    k -> new ArrayList<>()).add(sr);
        }

        log.info("Caches built successfully - Station cache: {}, Route cache: {}",
                stationCache.size(), stationRouteCache.size());
    }

    /**
     * Build graph representation with optimizations
     */
    public void buildGraph() {
        log.info("Building optimized graph from active routes");
        List<StationRoute> routes = stationRouteRepository.findAllByRouteStatus(Status.ACTIVE);

        // Initialize graph if not already done
        if (graph == null) {
            graph = new ConcurrentHashMap<>();
        }

        graph.clear();

        // Group by route ID for better performance
        Map<Long, List<StationRoute>> byRoute = routes.parallelStream()
                .collect(Collectors.groupingBy(sr -> sr.getRoute().getRouteId()));

        int totalEdges = 0;

        for (List<StationRoute> routeStations : byRoute.values()) {
            // Sort once per route
            routeStations.sort(Comparator.comparing(StationRoute::getStationOrder));

            // Build edges for this route
            for (int i = 0; i < routeStations.size() - 1; i++) {
                StationRoute current = routeStations.get(i);
                StationRoute next = routeStations.get(i + 1);

                Double distance = current.getDistanceToNext();
                if (distance == null || distance <= 0) {
                    log.warn("Invalid distance {} from station {} to {}",
                            distance, current.getStation().getStationName(),
                            next.getStation().getStationName());
                    continue;
                }

                Long currentId = current.getStation().getStationId();
                Long nextId = next.getStation().getStationId();

                // Add bidirectional edges
                addEdge(currentId, nextId, distance);
                addEdge(nextId, currentId, distance);
                totalEdges += 2;

                // Cache route connection - with null check
                if (routeConnectionCache != null) {
                    String connectionKey = Math.min(currentId, nextId) + "-" + Math.max(currentId, nextId);
                    routeConnectionCache.put(connectionKey, current.getRoute());
                }
            }
        }

        log.info("Optimized graph built with {} nodes and {} edges", graph.size(), totalEdges);
    }

    private void addEdge(Long from, Long to, double weight) {
        if (graph == null) {
            graph = new ConcurrentHashMap<>();
        }
        graph.computeIfAbsent(from, k -> new ArrayList<>()).add(new Edge(from, to, weight));
    }

    /**
     * Optimized k-shortest paths algorithm
     */
    public List<PathDTO> findKShortestPaths(Long source, Long dest, int k) {
        log.info("Finding {} shortest paths from {} to {}", k, source, dest);

        // Input validation
        if (source == null || dest == null) {
            throw new IllegalArgumentException("Source or destination cannot be null");
        }
        if (source.equals(dest)) {
            throw new IllegalArgumentException("Source and destination cannot be the same");
        }

        // Limit k for performance
        k = Math.min(k, 10);

        // Use more efficient data structures
        List<Path> foundPaths = new ArrayList<>();
        PriorityQueue<Path> candidates = new PriorityQueue<>(
                Comparator.comparingDouble(p -> p.totalDistance));

        // Use BitSet for faster duplicate detection if station IDs are small
        Set<String> uniquePathSignatures = new HashSet<>();

        // Find initial shortest path
        Path initialPath = optimizedDijkstra(source, dest, Collections.emptySet(), Collections.emptySet());
        if (initialPath == null) {
            log.info("No path found from {} to {}", source, dest);
            return Collections.emptyList();
        }

        foundPaths.add(initialPath);
        uniquePathSignatures.add(getPathSignature(initialPath.stations));

        // Yen's algorithm with optimizations
        for (int i = 1; i < k; i++) {
            Set<Edge> allBannedEdges = new HashSet<>();

            // Generate candidates from all found paths
            for (Path path : foundPaths) {
                List<Long> pathStations = path.stations;

                // Try each spur node (except last)
                for (int spurIndex = 0; spurIndex < pathStations.size() - 1; spurIndex++) {
                    Long spurNode = pathStations.get(spurIndex);
                    List<Long> rootPath = pathStations.subList(0, spurIndex + 1);

                    // Collect banned edges more efficiently
                    Set<Edge> bannedEdges = new HashSet<>();
                    for (Path existingPath : foundPaths) {
                        if (existingPath.stations.size() > spurIndex + 1 &&
                                existingPath.stations.subList(0, spurIndex + 1).equals(rootPath)) {

                            Long u = existingPath.stations.get(spurIndex);
                            Long v = existingPath.stations.get(spurIndex + 1);
                            bannedEdges.add(new Edge(u, v, 0));
                        }
                    }

                    // Ban root path nodes (except spur)
                    Set<Long> bannedNodes = new HashSet<>(rootPath);
                    bannedNodes.remove(spurNode);

                    // Find spur path
                    Path spurPath = optimizedDijkstra(spurNode, dest, bannedEdges, bannedNodes);

                    if (spurPath != null && spurPath.stations.size() > 1) {
                        // Create candidate path
                        List<Long> candidateStations = new ArrayList<>(rootPath);
                        candidateStations.addAll(spurPath.stations.subList(1, spurPath.stations.size()));

                        String signature = getPathSignature(candidateStations);
                        if (!uniquePathSignatures.contains(signature)) {
                            double distance = computeDistanceFast(candidateStations);
                            if (distance > 0) {
                                candidates.add(new Path(candidateStations, distance));
                            }
                        }
                    }
                }
            }

            // Get best unique candidate
            Path nextBest = null;
            while (!candidates.isEmpty() && nextBest == null) {
                Path candidate = candidates.poll();
                String signature = getPathSignature(candidate.stations);
                if (!uniquePathSignatures.contains(signature)) {
                    nextBest = candidate;
                    uniquePathSignatures.add(signature);
                }
            }

            if (nextBest == null) {
                break;
            }

            foundPaths.add(nextBest);
        }

        log.info("Found {} paths from {} to {}", foundPaths.size(), source, dest);
        return foundPaths.stream()
                .map(p -> new PathDTO(p.stations, p.totalDistance))
                .collect(Collectors.toList());
    }

    /**
     * Optimized Dijkstra with early termination and better data structures
     */
    private Path optimizedDijkstra(Long src, Long dest, Set<Edge> bannedEdges, Set<Long> bannedNodes) {
        if (src.equals(dest)) {
            return new Path(List.of(src), 0.0);
        }

        // Use primitive collections for better performance
        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> predecessors = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingDouble(n -> n.distance));
        Set<Long> visited = new HashSet<>();

        distances.put(src, 0.0);
        pq.offer(new Node(src, 0.0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            Long currentId = current.id;

            if (!visited.add(currentId)) {
                continue;
            }

            // Early termination when destination is reached
            if (currentId.equals(dest)) {
                break;
            }

            double currentDist = current.distance;
            List<Edge> edges = graph.get(currentId);
            if (edges == null) continue;

            for (Edge edge : edges) {
                Long neighborId = edge.to;

                // Skip banned edges and nodes
                if (bannedEdges.contains(edge) || bannedNodes.contains(neighborId)) {
                    continue;
                }

                double newDist = currentDist + edge.weight;
                Double existingDist = distances.get(neighborId);

                if (existingDist == null || newDist < existingDist) {
                    distances.put(neighborId, newDist);
                    predecessors.put(neighborId, currentId);
                    pq.offer(new Node(neighborId, newDist));
                }
            }
        }

        // Reconstruct path
        if (!distances.containsKey(dest)) {
            return null;
        }

        List<Long> path = new ArrayList<>();
        Long current = dest;
        while (current != null) {
            path.add(current);
            current = predecessors.get(current);
        }

        Collections.reverse(path);
        return new Path(path, distances.get(dest));
    }

    /**
     * Fast distance computation using cached graph
     */
    private double computeDistanceFast(List<Long> stations) {
        if (stations.size() < 2) return 0.0;

        double totalDistance = 0.0;
        for (int i = 0; i < stations.size() - 1; i++) {
            Long from = stations.get(i);
            Long to = stations.get(i + 1);

            List<Edge> edges = graph.get(from);
            if (edges == null) return -1.0;

            boolean found = false;
            for (Edge edge : edges) {
                if (edge.to.equals(to)) {
                    totalDistance += edge.weight;
                    found = true;
                    break;
                }
            }

            if (!found) return -1.0;
        }

        return totalDistance;
    }

    /**
     * Create path signature for duplicate detection
     */
    private String getPathSignature(List<Long> stations) {
        return stations.stream()
                .map(String::valueOf)
                .collect(Collectors.joining("-"));
    }

    // Optimized inner classes
    private static class Node {
        final Long id;
        final double distance;

        Node(Long id, double distance) {
            this.id = id;
            this.distance = distance;
        }
    }

    private static class Edge {
        final Long from, to;
        final double weight;

        public Edge(Long from, Long to, double weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Edge edge)) return false;
            return from.equals(edge.from) && to.equals(edge.to);
        }

        @Override
        public int hashCode() {
            return Objects.hash(from, to);
        }
    }

    private static class Path {
        final List<Long> stations;
        final double totalDistance;

        public Path(List<Long> stations, double totalDistance) {
            this.stations = stations;
            this.totalDistance = totalDistance;
        }
    }

        @Override
        public PathSearchResponse findKShortestPathsWithRoutes(Long source, Long dest, int k) {
            log.info("Finding {} shortest paths with routes from {} to {}", k, source, dest);

            List<PathDTO> shortestPaths = findKShortestPaths(source, dest, k);
            if (shortestPaths.isEmpty()) {
                return PathSearchResponse.builder().paths(List.of()).build();
            }

            // Parallel processing for better performance
            List<PathResponse> pathResponses = shortestPaths.parallelStream()
                    .map(this::convertToPathResponse)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            return PathSearchResponse.builder()
                    .paths(pathResponses)
                    .build();
        }

    private PathResponse convertToPathResponse(PathDTO pathDTO) {
        try {
            List<Long> stationIds = pathDTO.stations();
            Double totalDistance = pathDTO.totalDistance();

            List<RouteInPathResponse> routes = buildRoutesFromStationPathOptimized(stationIds);

            return PathResponse.builder()
                    .routes(routes)
                    .totalDistance(totalDistance)
                    .build();
        } catch (Exception e) {
            log.error("Error converting PathDTO to PathResponse: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Optimized route building using caches
     */
    private List<RouteInPathResponse> buildRoutesFromStationPathOptimized(List<Long> stationIds) {
        List<RouteInPathResponse> routes = new ArrayList<>();
        if (stationIds.size() < 2) return routes;

        Route currentRoute = null;
        List<StationInPathResponse> currentStations = new ArrayList<>();
        int globalOrder = 1;

        // Add first station using cache
        Station firstStation = stationCache != null ?
                stationCache.get(stationIds.get(0)) : stationRepository.findById(stationIds.get(0)).orElse(null);
        if (firstStation != null) {
            currentStations.add(StationInPathResponse.builder()
                    .stationId(firstStation.getStationId())
                    .stationName(firstStation.getStationName())
                    .stationLocation(firstStation.getStationLocation())
                    .order(globalOrder++)
                    .build());
        }

        for (int i = 0; i < stationIds.size() - 1; i++) {
            Long currentStationId = stationIds.get(i);
            Long nextStationId = stationIds.get(i + 1);

            // Use cached route lookup
            Route connectingRoute = findRouteConnectingStationsOptimized(currentStationId, nextStationId);
            if (connectingRoute == null) {
                log.warn("No route found connecting stations {} and {}", currentStationId, nextStationId);
                continue;
            }

            // Handle route changes
            if (currentRoute != null && !currentRoute.getRouteId().equals(connectingRoute.getRouteId())) {
                // Save previous route
                routes.add(RouteInPathResponse.builder()
                        .routeId(currentRoute.getRouteId())
                        .routeName(currentRoute.getRouteName())
                        .stations(new ArrayList<>(currentStations))
                        .build());

                // Start new route
                currentStations.clear();
                Station transferStation = stationCache != null ?
                        stationCache.get(currentStationId) : stationRepository.findById(currentStationId).orElse(null);
                if (transferStation != null) {
                    currentStations.add(StationInPathResponse.builder()
                            .stationId(transferStation.getStationId())
                            .stationName(transferStation.getStationName())
                            .stationLocation(transferStation.getStationLocation())
                            .order(globalOrder++)
                            .build());
                }
            }

            currentRoute = connectingRoute;

            // Add next station using cache
            Station nextStation = stationCache != null ?
                    stationCache.get(nextStationId) : stationRepository.findById(nextStationId).orElse(null);
            if (nextStation != null) {
                currentStations.add(StationInPathResponse.builder()
                        .stationId(nextStation.getStationId())
                        .stationName(nextStation.getStationName())
                        .stationLocation(nextStation.getStationLocation())
                        .order(globalOrder++)
                        .build());
            }
        }

        // Add final route
        if (currentRoute != null && !currentStations.isEmpty()) {
            routes.add(RouteInPathResponse.builder()
                    .routeId(currentRoute.getRouteId())
                    .routeName(currentRoute.getRouteName())
                    .stations(currentStations)
                    .build());
        }

        return routes;
    }

    /**
     * Optimized route finding using cache
     */
    private Route findRouteConnectingStationsOptimized(Long stationId1, Long stationId2) {
        // Check cache first - with null check
        if (routeConnectionCache != null) {
            String connectionKey = Math.min(stationId1, stationId2) + "-" + Math.max(stationId1, stationId2);
            Route cachedRoute = routeConnectionCache.get(connectionKey);
            if (cachedRoute != null) {
                return cachedRoute;
            }
        }

        // Use cached station routes if available, otherwise fallback to repository
        List<StationRoute> stationRoutes1 = stationRouteCache != null ?
                stationRouteCache.get(stationId1) : stationRouteRepository.findByStationId(stationId1);
        List<StationRoute> stationRoutes2 = stationRouteCache != null ?
                stationRouteCache.get(stationId2) : stationRouteRepository.findByStationId(stationId2);

        if (stationRoutes1 == null || stationRoutes2 == null) {
            return null;
        }

        // Find common active routes
        for (StationRoute sr1 : stationRoutes1) {
            if (sr1.getRoute().getStatus() != Status.ACTIVE) continue;

            for (StationRoute sr2 : stationRoutes2) {
                if (sr2.getRoute().getStatus() != Status.ACTIVE) continue;

                if (sr1.getRoute().getRouteId().equals(sr2.getRoute().getRouteId())) {
                    // Check if stations are adjacent
                    int orderDiff = Math.abs(sr1.getStationOrder() - sr2.getStationOrder());
                    if (orderDiff == 1) {
                        Route route = sr1.getRoute();
                        // Cache the result if cache is available
                        if (routeConnectionCache != null) {
                            String connectionKey = Math.min(stationId1, stationId2) + "-" + Math.max(stationId1, stationId2);
                            routeConnectionCache.put(connectionKey, route);
                        }
                        return route;
                    }
                }
            }
        }

        return null;
    }
}
