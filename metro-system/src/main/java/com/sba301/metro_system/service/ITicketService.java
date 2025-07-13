package com.sba301.metro_system.service;

import com.google.zxing.WriterException;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.user.UserEmailDto;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Booking;
import com.sba301.metro_system.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.ui.Model;


import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

public interface ITicketService {
     TicketResponseDto getTicketDetails(long ticketId) ;

//     void paymentTicketSuccess(long ticketId, Model model, long orderId) throws Exception;
     void paymentTicketSuccess(long ticketId, Model model, TicketResponseDto ticketDto) throws Exception;
     void paymentTicketFail(long ticketId, Model model) throws Exception;
     List<Ticket> buyOneTimeTicket(TicketRequestDto ticketRequestDto, Booking booking);
     Ticket buyUnlimitTicket(TicketRequestDto ticketRequestDto, Booking booking);
     boolean checkUnusedTicket(long ticketTypeId);
     BookingResponseDto buyTicket(TicketRequestDto ticketRequestDto) throws Exception;
     List<TicketResponseDto> getUserTickets();
     Page<TicketResponseDto> getAllTickets(int page, int size);

     //void checkExpiredTicket();


}
