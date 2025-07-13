package com.sba301.metro_system.controller;

import com.google.zxing.WriterException;
import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.ticketdetail.CheckTicketRequestDto;
import com.sba301.metro_system.dto.request.user.UserEmailDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.service.implement.TicketDetailService;
import com.sba301.metro_system.service.implement.TicketService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashSet;
import java.util.UUID;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@Tag(name = "Ticket")
public class TicketController {
    private final TicketService ticketService;
    private final TicketDetailService ticketDetailService;

    @PostMapping("/booking")
    public ResponseApi<?> buyTicket(@Valid @RequestBody TicketRequestDto ticket) throws Exception {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.buyTicket(ticket))
                .build();
    }

    @GetMapping("{id}")
    public ResponseApi<?> getTicketDetails(@PathVariable long id)  {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.getTicketDetails(id))
                .build();

    }

    @PutMapping("/success/{id}")
    public ResponseApi<?> updateSuccesStatus(@PathVariable long id,
                                             Model model,
                                             @RequestBody TicketResponseDto ticket) throws Exception  {
        ticketService.paymentTicketSuccess(id, model, ticket);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();

    }

    @PutMapping("/failed/{id}")
    public ResponseApi<?> updateFailedStatus(@PathVariable long id, Model model) throws Exception {
        System.out.println("updateFailedStatus");
        ticketService.paymentTicketFail(id, model);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();

    }

    @GetMapping("/user")
    public ResponseApi<?> getUserTicketHistory()  {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.getUserTickets())
                .build();
    }

    @GetMapping("/check")
    public ResponseApi<?> checkTicketExist(@RequestParam(name = "ticketTypeId") long ticketTypeId)  {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.checkUnusedTicket(ticketTypeId))
                .build();
    }

    @GetMapping()
    public ResponseApi<?> getAllTickets(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "5") int size)  {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketService.getAllTickets(page, size))
                .build();
    }

    @PostMapping("/check-in")
    public ResponseApi<?> checkin(
                                  @RequestBody CheckTicketRequestDto dto) throws BadRequestException {

        ticketDetailService.checkIn(dto);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @PostMapping("/check-out")
    public ResponseApi<?> checkout(@RequestBody CheckTicketRequestDto dto) throws BadRequestException {
        ticketDetailService.checkOut(dto);
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @GetMapping("history/{ticketId}")
    public ResponseApi<?> getUserTicketHistory(@PathVariable long ticketId)  {
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(ticketDetailService.getAllTicketDetailsByTicketId(ticketId))
                .build();
    }










}
