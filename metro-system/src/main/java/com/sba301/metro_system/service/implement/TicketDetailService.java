package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.response.TicketDetailResponseDto;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.TicketDetail;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.enums.StatusCode;
import com.sba301.metro_system.enums.TicketStatus;
import com.sba301.metro_system.exception.CustomException;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.mapper.TicketDetailMapper;
import com.sba301.metro_system.repository.TicketDetailRepository;
import com.sba301.metro_system.repository.TicketRepository;
import com.sba301.metro_system.service.ITicketDetailService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketDetailService implements ITicketDetailService {

    private final TicketDetailRepository ticketDetailRepository;
    private final TicketRepository ticketRepository;


    /**
     * Find ticket detail by ticketId
     * If checkin in the first time
     * Create new record -> update checkin time
     * Update status of ticket -> USING
     * If ticket is one way -> checkin one time -> exception if checkin again
     * If ticket is travel pass ->
     */
    @Override
    @Transactional
    public void checkIn(long ticketId) throws BadRequestException {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        // Ticket expired
        if (ticket.getTicketStatus().equals(TicketStatus.EXPIRED)) {
            throw new CustomException(StatusCode.TICKET_EXPIRED.getCode(),
                    StatusCode.TICKET_EXPIRED.getMessage());
        }

        //Ticket cancelled
        if (ticket.getTicketStatus().equals(TicketStatus.CANCELLED)) {
            throw new CustomException(StatusCode.TICKET_BUY_FAILED.getCode(),
                    StatusCode.TICKET_BUY_FAILED.getMessage());
        }

        if (ticket.getIsCheckin()) {
            throw new CustomException(StatusCode.TICKET_NOT_CHECK_OUT.getCode(),
                                        StatusCode.TICKET_NOT_CHECK_OUT.getMessage());
        }

//        TicketDetail ticketDetail = ticketDetailRepository.findByTicket(ticket).orElse(null);
        //ticket already checked-in
//        if (ticketDetailRepository.existsByTicket(ticket) && ticket.getTicketType().getUsageLimit()) {
//            throw new CustomException(StatusCode.Ticket_.getCode(),
//                    StatusCode.TICKET_EXPIRED.getMessage());
//        }
        // Travel pass checkin the first time
        boolean exists = ticketDetailRepository.existsByTicket(ticket);
        boolean unlimit = ticket.getTicketType().getUsageLimit();
        if ((exists == false) && (unlimit == false)) {
            LocalDateTime now = LocalDateTime.now();
            ticket.setValidFrom(now);
            ticket.setValidTo(now.plusDays(ticket.getTicketType().getValidityDays()));
        }


        // create new ticket detail if ticket is not checked-in
        TicketDetail newTicketDetail  = new TicketDetail();
        newTicketDetail.setTicket(ticket);
        newTicketDetail.setCheckIn(LocalDateTime.now());

        //Update ticket status
        ticket.setTicketStatus(TicketStatus.ACTIVE);
        ticket.setIsCheckin(true);

        ticketDetailRepository.save(newTicketDetail);
        ticketRepository.save(ticket);

    }

    /**
     * Find ticket by ticketId and ticketDetailId
     * Find ticketDetailId by looking up ticketdetail without checkout
     * Update ticket status if ticket is one way
     * Update checkout time if ticket is travel pass
     * if (
     */
    @Override
    @Transactional
    public void checkOut(long ticketId) throws BadRequestException {

        Ticket ticket = ticketRepository.findByTicketIdAndTicketStatusIn(ticketId, List.of(TicketStatus.ACTIVE))
                .orElseThrow(() -> new CustomException(StatusCode.TICKET_NOT_ACTIVE.getCode(),
                StatusCode.TICKET_NOT_ACTIVE.getMessage()));

        if (ticket.getTicketStatus().equals(TicketStatus.EXPIRED)) {
            throw new CustomException(StatusCode.TICKET_EXPIRED.getCode(),
                    StatusCode.TICKET_EXPIRED.getMessage());
        }

        if (ticket.getTicketStatus().equals(TicketStatus.CANCELLED)) {
            throw new CustomException(StatusCode.TICKET_BUY_FAILED.getCode(),
                    StatusCode.TICKET_BUY_FAILED.getMessage());
        }

        if (!ticket.getIsCheckin())  {
            throw new CustomException(StatusCode.TICKET_NOT_CHECK_IN.getCode(),
                    StatusCode.TICKET_NOT_CHECK_IN.getMessage());
        }



        TicketDetail ticketDetail = ticket.getTicketType().getUsageLimit()
                ? ticketDetailRepository.findByTicket(ticket).orElseThrow(() -> new CustomException(StatusCode.TICKET_NOT_CHECK_IN.getCode(),
                                                                                                    StatusCode.TICKET_NOT_CHECK_IN.getMessage()))
                : ticketDetailRepository.findByTicketAndCheckOutNull(ticket).orElseThrow(() -> new CustomException(StatusCode.TICKET_NOT_CHECK_IN.getCode(),
                                                                                                                    StatusCode.TICKET_NOT_CHECK_IN.getMessage()));

        ticketDetail.setCheckOut(LocalDateTime.now());
        if (ticket.getTicketType().getUsageLimit()) {
            ticket.setTicketStatus(TicketStatus.EXPIRED);
        } else {
            ticket.setIsCheckin(false);
        }
        ticketDetailRepository.save(ticketDetail);
        ticketRepository.save(ticket);
    }

    public List<TicketDetailResponseDto> getAllTicketDetailsByTicketId(long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new NotFoundException("Ticket not found"));
        return ticketDetailRepository.findAllByTicket(ticket)
                .stream()
                .map(TicketDetailMapper::toTicketDetailResponseDto)
                .collect(Collectors.toList());
    }
}
