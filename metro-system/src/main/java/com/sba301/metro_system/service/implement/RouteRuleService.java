package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.entity.RouteRule;
import com.sba301.metro_system.repository.RouteRuleRepository;
import com.sba301.metro_system.service.IRouteRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteRuleService implements IRouteRuleService {
    private final RouteRuleRepository routeRuleRepository;
    @Override
    public RouteRule findByRouteIdAndType(long routeId, long ticketTypeId) {
        return routeRuleRepository.findRuleByRouteIdAndType(routeId, ticketTypeId) ;
    }


}
