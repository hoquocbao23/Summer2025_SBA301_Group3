package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.RouteRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RouteRuleRepository extends JpaRepository<RouteRule, Long> {

    @Query("SELECT r FROM RouteRule r WHERE r.route.routeId =:routeId AND r.ticketType.ticketTypeId =:ticketTypeId")
    RouteRule findRuleByRouteIdAndType(Long routeId, Long ticketTypeId);
}
