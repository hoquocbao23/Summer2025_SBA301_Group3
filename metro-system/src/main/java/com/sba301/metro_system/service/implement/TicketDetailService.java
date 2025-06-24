package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.TicketDetail;
import com.sba301.metro_system.enums.TicketStatus;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.TicketDetailRepository;
import com.sba301.metro_system.repository.TicketRepository;
import com.sba301.metro_system.service.ITicketDetailService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    public void checkIn(long ticketId) throws BadRequestException {
//        Ticket ticket = ticketRepository.findByTicketIdAndTicketStatusIn(ticketId,
//                List.of(TicketStatus.UNUSED, TicketStatus.ACTIVE))
//                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        Ticket ticket = ticketRepository.findById(ticketId)

                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        if (ticket.getIsCheckin()) {
            throw new BadRequestException("Checkout before checkin");
        }


//        TicketDetail ticketDetail = ticketDetailRepository.findByTicket(ticket).orElse(null);

        //ticket already checked-in
        if (ticketDetailRepository.existsById(ticketId) && ticket.getTicketType().getUsageLimit()) {
            throw new BadRequestException("This ticket already USED");
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
    public void checkOut(long ticketId) throws BadRequestException {

        Ticket ticket = ticketRepository.findByTicketIdAndTicketStatusIn(ticketId, List.of(TicketStatus.ACTIVE)).orElseThrow(() -> new NotFoundException("Ticket not found"));

        if (!ticket.getIsCheckin())  {
            throw new BadRequestException("Check in before checkout");
        }

        TicketDetail ticketDetail = ticket.getTicketType().getUsageLimit()
                ? ticketDetailRepository.findByTicket(ticket).orElseThrow(() -> new NotFoundException("Check in before checkout"))
                : ticketDetailRepository.findByTicketAndCheckOutNull(ticket).orElseThrow(() -> new NotFoundException("Check in before checkout"));

        ticketDetail.setCheckOut(LocalDateTime.now());
        if (ticket.getTicketType().getUsageLimit()) {
            ticket.setTicketStatus(TicketStatus.EXPIRED);
        } else {
            ticket.setIsCheckin(false);
        }
        ticketDetailRepository.save(ticketDetail);
        ticketRepository.save(ticket);
    }
}
