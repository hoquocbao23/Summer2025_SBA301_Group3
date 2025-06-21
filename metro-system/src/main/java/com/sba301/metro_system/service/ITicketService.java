package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface ITicketService {
     TicketResponseDto getTicketDetails(long ticketId) ;
     TicketResponseDto buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception;
     void paymentTicketSuccess(long ticketId);
     void paymentTicketFail(long ticketId);

     boolean checkUnusedTicket(long ticketTypeId);

     List<TicketResponseDto> getUserTickets();
     Page<TicketResponseDto> getAllTickets(int page, int size);
}
