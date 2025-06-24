package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Route;
import com.sba301.metro_system.entity.TicketRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    Optional<Route> findByRouteName(String routeName);

    List<Route> findByTicketRule(TicketRule ticketRule);

    @Query("SELECT r FROM Route r WHERE LOWER(r.routeName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Route> findByRouteNameContaining(@Param("keyword") String keyword);

    @Query("SELECT r FROM Route r WHERE LOWER(r.routeDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Route> findByRouteDescriptionContaining(@Param("keyword") String keyword);

    boolean existsByRouteName(String routeName);

    @Query("SELECT COUNT(r) > 0 FROM Route r WHERE r.routeName = :routeName AND r.routeId != :routeId")
    boolean existsByRouteNameAndRouteIdNot(@Param("routeName") String routeName, @Param("routeId") Long routeId);

    @Query("SELECT r FROM Route r WHERE r.estimatedDuration BETWEEN :minDuration AND :maxDuration")
    List<Route> findByEstimatedDurationBetween(@Param("minDuration") Integer minDuration, @Param("maxDuration") Integer maxDuration);

    @Query("SELECT r FROM Route r WHERE r.frequencyMinutes BETWEEN :minFreq AND :maxFreq")
    List<Route> findByFrequencyMinutesBetween(@Param("minFreq") Integer minFreq, @Param("maxFreq") Integer maxFreq);
}
