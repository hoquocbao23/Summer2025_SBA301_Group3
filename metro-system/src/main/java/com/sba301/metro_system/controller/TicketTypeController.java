package com.sba301.metro_system.controller;
import com.sba301.metro_system.dto.ResponseApi;

import com.sba301.metro_system.dto.request.tickettype.TicketTypeDto;
import com.sba301.metro_system.service.ITicketTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ticket-types")
@RequiredArgsConstructor
@Tag(name = "TicketType")
public class TicketTypeController {

    private final ITicketTypeService ticketTypeService;

    @GetMapping("/{id}")
    public ResponseApi<?> getTicketTypeById(@PathVariable long id) {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketTypeService.findById(id))
                .build();
    }

    @GetMapping
    public ResponseApi<?> getAllTicketTypes() {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketTypeService.findAll())
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseApi<?> createTicketType(@Valid @RequestBody TicketTypeDto ticketTypeDto) {
        return ResponseApi.builder()
                .status(HttpStatus.CREATED.value())
                .message(HttpStatus.CREATED.getReasonPhrase())
                .data(ticketTypeService.createTicketType(ticketTypeDto))
                .build();
    }

    @PatchMapping("/{id}")
    public ResponseApi<?>  updateTicketType( @PathVariable long id, @RequestBody TicketTypeDto ticketTypeDto) {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketTypeService.updateTicketType(id, ticketTypeDto))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseApi<?> deleteTicketType(@PathVariable long id) {
        ticketTypeService.deleteTicketType(id);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket type deleted successfully")
                .data(null)
                .build();
    }

    @GetMapping("/unlimit")
    public ResponseApi<?> getUnlimitTicketTypes() {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket type deleted successfully")
                .data(ticketTypeService.findAllUnlimitTicketTypes())
                .build();
    }

    @GetMapping("/limit")
    public ResponseApi<?> getTicketTypes() {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message("Ticket type deleted successfully")
                .data(ticketTypeService.findAllLimitTicketTypes())
                .build();
    }


}
