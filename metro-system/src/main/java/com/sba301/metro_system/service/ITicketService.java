package com.sba301.metro_system.service;

import com.google.zxing.WriterException;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.user.UserEmailDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;


import java.io.IOException;
import java.util.HashSet;
import java.util.List;

public interface ITicketService {
     TicketResponseDto getTicketDetails(long ticketId) ;
     TicketResponseDto buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception;
     void paymentTicketSuccess(long ticketId, Model model);
     void paymentTicketFail(long ticketId, Model model) throws Exception;

     boolean checkUnusedTicket(long ticketTypeId);

     List<TicketResponseDto> getUserTickets();
     Page<TicketResponseDto> getAllTickets(int page, int size);
}
