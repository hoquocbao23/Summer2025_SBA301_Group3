package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.service.implement.TicketDetailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ticket-details")
@RequiredArgsConstructor
@Tag(name = "TicketDetail")
public class TicketDetailController {
    private final TicketDetailService ticketDetailService;

//    @GetMapping("/{ticketId}")
//    public ResponseApi<?> getUserTicketHistory(@PathVariable long ticketId)  {
//        return ResponseApi.builder()
//                .status(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .data(ticketDetailService.getAllTicketDetailsByTicketId(ticketId))
//                .build();
//    }
}
