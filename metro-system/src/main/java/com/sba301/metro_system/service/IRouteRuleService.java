package com.sba301.metro_system.service;

import com.sba301.metro_system.entity.RouteRule;

public interface IRouteRuleService {
    RouteRule findByRouteIdAndType(long routeId, long ticketTypeId);
}
