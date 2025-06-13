package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.TicketRequestDto;
import jakarta.servlet.http.HttpServletResponse;

public interface ITicketService {
     String buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception;

}
