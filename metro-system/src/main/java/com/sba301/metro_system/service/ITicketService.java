package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;

public interface ITicketService {
     TicketResponseDto getTicketDetails(long ticketId) ;
     TicketResponseDto buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception;
     void paymentTicketSuccess(long ticketId);
     void paymentTicketFail(long ticketId);

}
