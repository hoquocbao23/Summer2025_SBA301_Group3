package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.ticketdetail.CheckTicketRequestDto;
import org.apache.coyote.BadRequestException;

import java.util.UUID;

public interface ITicketDetailService {
    void checkIn( CheckTicketRequestDto dto) throws BadRequestException;
    void checkOut(CheckTicketRequestDto dto) throws BadRequestException;
}
