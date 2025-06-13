package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.TicketRequestDto;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.service.implement.TicketService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@Tag(name = "Ticket")
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("/unlimit")
    public ResponseApi<?> buyUnlimitTicket(@Valid @RequestBody TicketRequestDto ticket) throws Exception {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.buyUnlimitTicket(ticket))
                .build();

    }
}
