package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.RouteRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RouteRuleRepository extends JpaRepository<RouteRule, Long> {

    @Query("SELECT r FROM RouteRule r WHERE r.route.routeId =:routeId AND r.type =:type")
    RouteRule findRuleByRouteIdAndType(Long routeId, String type);
}
