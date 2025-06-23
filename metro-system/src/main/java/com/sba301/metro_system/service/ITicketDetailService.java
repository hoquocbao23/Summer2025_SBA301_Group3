package com.sba301.metro_system.service;

import org.apache.coyote.BadRequestException;

public interface ITicketDetailService {
    void checkIn(long ticketId) throws BadRequestException;
    void checkOut(long ticketId) throws BadRequestException;
}
