package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.Station;
import com.sba301.metro_system.entity.StationRoute;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRouteRepository extends JpaRepository<StationRoute, Long> {

    List<StationRoute> findByRouteOrderByStationOrder(Route route);

    @Query("SELECT sr FROM StationRoute sr WHERE sr.route.routeId = :routeId ORDER BY sr.stationOrder")
    List<StationRoute> findByRouteIdOrderByStationOrder(@Param("routeId") Long routeId);

    List<StationRoute> findByStation(Station station);

    @Query("SELECT sr FROM StationRoute sr WHERE sr.station.stationId = :stationId")
    List<StationRoute> findByStationId(@Param("stationId") Long stationId);

    Optional<StationRoute> findByRouteAndStation(Route route, Station station);

    @Query("SELECT sr FROM StationRoute sr WHERE sr.route.routeId = :routeId AND sr.station.stationId = :stationId")
    Optional<StationRoute> findByRouteIdAndStationId(@Param("routeId") Long routeId, @Param("stationId") Long stationId);

    boolean existsByRouteAndStation(Route route, Station station);

    void deleteByRoute(Route route);

    @Query("DELETE FROM StationRoute sr WHERE sr.route.routeId = :routeId")
    void deleteByRouteId(@Param("routeId") Long routeId);

    @Query("SELECT MAX(sr.stationOrder) FROM StationRoute sr WHERE sr.route = :route")
    Integer findMaxStationOrderByRoute(@Param("route") Route route);

    @Query("SELECT sr FROM StationRoute sr WHERE sr.route = :route AND sr.stationOrder BETWEEN :startOrder AND :endOrder ORDER BY sr.stationOrder")
    List<StationRoute> findByRouteAndStationOrderBetween(@Param("route") Route route, @Param("startOrder") Integer startOrder, @Param("endOrder") Integer endOrder);
    
    // Tìm tất cả các route chứa cả 2 trạm
    @Query("SELECT DISTINCT sr1.route FROM StationRoute sr1 " +
           "INNER JOIN StationRoute sr2 ON sr1.route = sr2.route " +
           "WHERE sr1.station.stationId = :sourceStationId " +
           "AND sr2.station.stationId = :destinationStationId " +
           "AND sr1.route.status = com.sba301.metro_system.enums.Status.ACTIVE")
    List<Route> findRoutesBetweenStations(@Param("sourceStationId") Long sourceStationId, 
                                         @Param("destinationStationId") Long destinationStationId);
    
    // Tìm thông tin trạm trong một route cụ thể
    @Query("SELECT sr FROM StationRoute sr " +
           "WHERE sr.route = :route " +
           "AND sr.station.stationId IN (:sourceStationId, :destinationStationId) " +
           "ORDER BY sr.stationOrder")
    List<StationRoute> findStationInfoInRoute(@Param("route") Route route,
                                             @Param("sourceStationId") Long sourceStationId,
                                             @Param("destinationStationId") Long destinationStationId);

    List<StationRoute> findAllByRouteStatus(Status status);
}
