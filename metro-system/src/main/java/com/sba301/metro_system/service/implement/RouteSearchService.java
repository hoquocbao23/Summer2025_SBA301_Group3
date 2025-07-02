package com.sba301.metro_system.service.implement;

import com.beust.ah.A;
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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteSearchService implements com.sba301.metro_system.service.IRouteSearchService {

    private final StationRouteRepository stationRouteRepository;
    private final StationRepository stationRepository;

    private Map<Long, List<Edge>> graph;

    @PostConstruct
    public void initGraph() {
        buildGraph();
    }

    /**
     * Build graph representation: node = stationId, edges between adjacent stations on active routes
     */
    public void buildGraph() {
        log.info("Building graph from active routes");
        List<StationRoute> routes = stationRouteRepository.findAllByRouteStatus(Status.ACTIVE);
        Map<Long, List<StationRoute>> byRoute = routes.stream()
                .collect(Collectors.groupingBy(sr -> sr.getRoute().getRouteId()));

        graph = new HashMap<>();
        int totalEdges = 0;

        for (List<StationRoute> list : byRoute.values()) {
            list.sort(Comparator.comparing(StationRoute::getStationOrder));
            for (int i = 0; i < list.size() - 1; i++) {
                StationRoute cur = list.get(i);
                StationRoute next = list.get(i + 1);

                if (cur.getDistanceToNext() == null || cur.getDistanceToNext() <= 0) {
                    log.warn("Invalid distance {} from station {} to {}",
                            cur.getDistanceToNext(),
                            cur.getStation().getStationName(),
                            next.getStation().getStationName());
                    continue;
                }

                double dist = cur.getDistanceToNext();
                addEdge(cur.getStation().getStationId(), next.getStation().getStationId(), dist);
                addEdge(next.getStation().getStationId(), cur.getStation().getStationId(), dist);
                totalEdges += 2;

                log.debug("Added bidirectional edge: {} <-> {} (distance: {})",
                         cur.getStation().getStationName(),
                         next.getStation().getStationName(),
                         dist);
            }
        }

        log.info("Graph built successfully with {} nodes and {} edges", graph.size(), totalEdges);
    }

    private void addEdge(Long from, Long to, double weight) {
        graph.computeIfAbsent(from, k -> new ArrayList<>()).add(new Edge(from, to, weight));
    }

    /**
     * Find k shortest simple paths without revisiting same nodes or edges
     */
    public List<PathDTO> findKShortestPaths(Long source, Long dest, int k) {
        log.info("Finding {} shortest paths from station {} to station {}", k, source, dest);

        // Validate inputs
        if (source == null || dest == null) {
            log.warn("Source or destination is null");
            throw new IllegalArgumentException("Source or destination is null");
        }

        if (source.equals(dest)) {
            log.warn("Source and destination are the same");
            throw new IllegalArgumentException("Source and destination are the same");
        }

        // Limit k to prevent excessive computation
        k = Math.min(k, 10);

        // Store found paths and candidates
        List<Path> A = new ArrayList<>();
        PriorityQueue<Path> B = new PriorityQueue<>(Comparator.comparingDouble(p -> p.totalDistance));

        // Set to track unique paths and avoid duplicates
        Set<List<Long>> uniquePaths = new HashSet<>();

        // Find initial shortest path
        Path p0 = dijkstra(source, dest, Collections.emptySet(), Collections.emptySet());
        if (p0 == null) {
            log.info("No path found from {} to {}", source, dest);
            return Collections.emptyList();
        }
        A.add(p0);
        uniquePaths.add(new ArrayList<>(p0.stations));
        log.debug("Initial path: {} with distance: {}", p0.stations, p0.totalDistance);

        // Find k-1 additional paths
        for (int i = 1; i < k; i++) {
            // Generate candidate paths from all previous paths
            for (int pathIndex = 0; pathIndex < A.size(); pathIndex++) {
                Path currentPath = A.get(pathIndex);

                // Try each node as spur node (except the last one)
                for (int spurIndex = 0; spurIndex < currentPath.stations.size() - 1; spurIndex++) {
                    Long spurNode = currentPath.stations.get(spurIndex);
                    List<Long> rootPath = new ArrayList<>(currentPath.stations.subList(0, spurIndex + 1));

                    // Collect edges to ban (edges used by paths with same root)
                    Set<Edge> bannedEdges = new HashSet<>();
                    for (Path path : A) {
                        if (path.stations.size() > spurIndex &&
                                path.stations.subList(0, spurIndex + 1).equals(rootPath) &&
                                spurIndex + 1 < path.stations.size()) {

                            Long u = path.stations.get(spurIndex);
                            Long v = path.stations.get(spurIndex + 1);
                            bannedEdges.add(new Edge(u, v, 0));
                        }
                    }

                    // Ban nodes in root path (except spur node) to avoid cycles
                    Set<Long> bannedNodes = new HashSet<>(rootPath);
                    bannedNodes.remove(spurNode);

                    // Find spur path from spur node to destination
                    Path spurPath = dijkstra(spurNode, dest, bannedEdges, bannedNodes);

                    if (spurPath != null && spurPath.stations.size() > 1) {
                        // Combine root path with spur path
                        List<Long> candidateStations = new ArrayList<>(rootPath);
                        candidateStations.addAll(spurPath.stations.subList(1, spurPath.stations.size()));

                        // Validate and check uniqueness
                        if (candidateStations.size() > 1 &&
                                candidateStations.get(0).equals(source) &&
                                candidateStations.get(candidateStations.size() - 1).equals(dest) &&
                                !uniquePaths.contains(candidateStations)) {

                            double candidateDistance = computeDistance(candidateStations);
                            if (candidateDistance > 0) {
                                Path candidate = new Path(candidateStations, candidateDistance);
                                B.add(candidate);
                                log.debug("Added candidate path: {} with distance: {}",
                                        candidateStations, candidateDistance);
                            }
                        }
                    }
                }
            }

            // Find the best unique candidate
            Path nextBest = null;
            while (!B.isEmpty() && nextBest == null) {
                Path candidate = B.poll();
                if (!uniquePaths.contains(candidate.stations)) {
                    nextBest = candidate;
                } else {
                    log.debug("Skipping duplicate candidate: {}", candidate.stations);
                }
            }

            if (nextBest == null) {
                log.debug("No more unique paths found, stopping at {} paths", A.size());
                break;
            }

            A.add(nextBest);
            uniquePaths.add(new ArrayList<>(nextBest.stations));
            log.debug("Found path {}: {} with distance: {}", i + 1, nextBest.stations, nextBest.totalDistance);
        }

        log.info("Found {} unique paths from {} to {}", A.size(), source, dest);
        return A.stream()
                .map(p -> new PathDTO(p.stations, p.totalDistance))
                .collect(Collectors.toList());
    }

    /**
     * Dijkstra algorithm with banned edges and banned nodes to ensure simple paths
     */
    private Path dijkstra(Long src, Long dest, Set<Edge> bannedEdges, Set<Long> bannedNodes) {
        if (src.equals(dest)) {
            return new Path(Arrays.asList(src), 0.0);
        }

        Map<Long, Double> dist = new HashMap<>();
        Map<Long, Long> prev = new HashMap<>();
        // Use double array instead of long array for better precision
        PriorityQueue<double[]> pq = new PriorityQueue<>(Comparator.comparingDouble(a -> a[1]));
        dist.put(src, 0.0);
        pq.add(new double[]{src.doubleValue(), 0.0});

        Set<Long> visited = new HashSet<>();
        int maxIterations = 10000; // Prevent infinite loops
        int iterations = 0;

        while (!pq.isEmpty() && iterations < maxIterations) {
            iterations++;
            double[] top = pq.poll();
            Long u = (long) top[0];
            double d = top[1];

            if (!visited.add(u)) continue;
            if (u.equals(dest)) break;

            List<Edge> edges = graph.getOrDefault(u, Collections.emptyList());
            for (Edge e : edges) {
                if (bannedEdges.contains(e) || bannedNodes.contains(e.to)) continue;

                double nd = d + e.weight;
                Double currentDist = dist.get(e.to);

                if (currentDist == null || nd < currentDist) {
                    dist.put(e.to, nd);
                    prev.put(e.to, u);
                    pq.add(new double[]{e.to.doubleValue(), nd});
                }
            }
        }

        if (iterations >= maxIterations) {
            log.warn("Dijkstra algorithm reached max iterations limit for path from {} to {}", src, dest);
            return null;
        }

        if (!dist.containsKey(dest)) {
            log.debug("No path found from {} to {}", src, dest);
            return null;
        }

        List<Long> path = new ArrayList<>();
        Long current = dest;
        int pathIterations = 0;
        int maxPathIterations = 1000; // Prevent infinite loop in path reconstruction

        while (current != null && pathIterations < maxPathIterations) {
            pathIterations++;
            path.add(current);
            current = prev.get(current);

            // Break if we've reached the source
            if (current != null && current.equals(src)) {
                path.add(src);
                break;
            }
        }

        if (pathIterations >= maxPathIterations) {
            log.warn("Path reconstruction reached max iterations limit");
            return null;
        }

        Collections.reverse(path);
        return new Path(path, dist.get(dest));
    }

    private double computeDistance(List<Long> stations) {
        if (stations == null || stations.size() < 2) {
            return 0.0;
        }

        double sum = 0;
        for (int i = 0; i < stations.size() - 1; i++) {
            Long u = stations.get(i);
            Long v = stations.get(i + 1);

            List<Edge> edges = graph.get(u);
            if (edges == null) {
                log.warn("No edges found for station {}", u);
                continue;
            }

            Optional<Edge> edgeOpt = edges.stream()
                    .filter(e -> e.to.equals(v))
                    .findFirst();

            if (edgeOpt.isPresent()) {
                sum += edgeOpt.get().weight;
            } else {
                log.warn("No edge found from station {} to station {}", u, v);
                // Return -1 to indicate invalid path
                return -1.0;
            }
        }
        return sum;
    }

    private static class Edge {
        Long from, to;
        double weight;
        public Edge(Long from, Long to, double weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
        @Override public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Edge edge)) return false;
            return from.equals(edge.from) && to.equals(edge.to);
        }
        @Override public int hashCode() {
            return Objects.hash(from, to);
        }
    }

    private static class Path {
        List<Long> stations;
        double totalDistance;
        public Path(List<Long> stations, double totalDistance) {
            this.stations = stations;
            this.totalDistance = totalDistance;
        }
    }

    @Override
    public PathSearchResponse findKShortestPathsWithRoutes(Long source, Long dest, int k) {
        log.info("Finding {} shortest paths with route details from station {} to station {}", k, source, dest);

        // Find k shortest paths using existing algorithm
        List<PathDTO> shortestPaths = findKShortestPaths(source, dest, k);

        if (shortestPaths.isEmpty()) {
            log.info("No paths found between station {} and station {}", source, dest);
            return PathSearchResponse.builder()
                    .paths(List.of())
                    .build();
        }

        // Convert each PathDTO to PathResponse with route details
        List<PathResponse> pathResponses = shortestPaths.stream()
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

            log.debug("Converting path with {} stations and total distance {}", stationIds.size(), totalDistance);

            // Group consecutive stations by their routes
            List<RouteInPathResponse> routes = buildRoutesFromStationPath(stationIds);

            return PathResponse.builder()
                    .routes(routes)
                    .totalDistance(totalDistance)
                    .build();

        } catch (Exception e) {
            log.error("Error converting PathDTO to PathResponse: {}", e.getMessage());
            return null;
        }
    }    private List<RouteInPathResponse> buildRoutesFromStationPath(List<Long> stationIds) {
        List<RouteInPathResponse> routes = new ArrayList<>();

        if (stationIds.size() < 2) {
            return routes;
        }

        // Track the current route and stations
        Route currentRoute = null;
        List<StationInPathResponse> currentStations = new ArrayList<>();
        int globalOrder = 1;

        // Add the first station
        Station firstStation = stationRepository.findById(stationIds.getFirst()).orElse(null);
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

            // Find the route that connects these two stations
            Route connectingRoute = findRouteConnectingStations(currentStationId, nextStationId);

            if (connectingRoute == null) {
                log.warn("No route found connecting station {} and station {}", currentStationId, nextStationId);
                continue;
            }

            // If this is a new route (route change)
            if (currentRoute != null && !currentRoute.getRouteId().equals(connectingRoute.getRouteId())) {
                // Save the previous route
                routes.add(RouteInPathResponse.builder()
                        .routeId(currentRoute.getRouteId())
                        .routeName(currentRoute.getRouteName())
                        .stations(new ArrayList<>(currentStations))
                        .build());

                // Start new route with the current station (transfer station)
                currentStations.clear();
                Station transferStation = stationRepository.findById(currentStationId).orElse(null);
                if (transferStation != null) {
                    currentStations.add(StationInPathResponse.builder()
                            .stationId(transferStation.getStationId())
                            .stationName(transferStation.getStationName())
                            .stationLocation(transferStation.getStationLocation())
                            .order(globalOrder++)
                            .build());
                }
            }

            // Set current route
            currentRoute = connectingRoute;

            // Add the next station
            Station nextStation = stationRepository.findById(nextStationId).orElse(null);
            if (nextStation != null) {
                currentStations.add(StationInPathResponse.builder()
                        .stationId(nextStation.getStationId())
                        .stationName(nextStation.getStationName())
                        .stationLocation(nextStation.getStationLocation())
                        .order(globalOrder++)
                        .build());
            }
        }
        
        // Add the last route
        if (currentRoute != null && !currentStations.isEmpty()) {
            routes.add(RouteInPathResponse.builder()
                    .routeId(currentRoute.getRouteId())
                    .routeName(currentRoute.getRouteName())
                    .stations(currentStations)
                    .build());
        }
        
        return routes;
    }

    private Route findRouteConnectingStations(Long stationId1, Long stationId2) {
        // Find all routes that contain both stations
        List<StationRoute> stationRoutes1 = stationRouteRepository.findByStationId(stationId1);
        List<StationRoute> stationRoutes2 = stationRouteRepository.findByStationId(stationId2);

        // Find common routes
        for (StationRoute sr1 : stationRoutes1) {
            for (StationRoute sr2 : stationRoutes2) {
                if (sr1.getRoute().getRouteId().equals(sr2.getRoute().getRouteId()) &&
                        sr1.getRoute().getStatus() == Status.ACTIVE) {

                    // Check if these stations are adjacent in the route
                    int orderDiff = Math.abs(sr1.getStationOrder() - sr2.getStationOrder());
                    if (orderDiff == 1) {
                        return sr1.getRoute();
                    }
                }
            }
        }

        return null;
    }


}
