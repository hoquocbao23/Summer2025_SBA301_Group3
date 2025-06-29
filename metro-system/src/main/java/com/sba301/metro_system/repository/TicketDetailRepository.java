package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.TicketDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketDetailRepository extends JpaRepository<TicketDetail, Long> {


    Optional<TicketDetail> findByTicket(Ticket ticketId);
    Optional<TicketDetail> findByTicketAndCheckOutNull(Ticket ticketId);

    boolean existsByTicket(Ticket ticketId);


    List<TicketDetail> findAllByTicket(Ticket ticketId);
}
