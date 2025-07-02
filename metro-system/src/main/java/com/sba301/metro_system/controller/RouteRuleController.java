package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.service.implement.RouteRuleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rules")
@Tag(name = "Route Rule")
public class RouteRuleController {
    private final RouteRuleService routeRuleService;

    @GetMapping("/detail")
    public ResponseApi<?> createPromotion(@RequestParam(name = "routeId") long routeId,
                                          @RequestParam(name = "ticketType") long ticketTypeId) {
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(routeRuleService.findByRouteIdAndType(routeId, ticketTypeId))
                .build();
    }

}
