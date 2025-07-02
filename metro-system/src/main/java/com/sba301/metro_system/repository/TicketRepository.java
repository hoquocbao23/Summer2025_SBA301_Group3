package com.sba301.metro_system.repository;

import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

//    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END " +
//            "FROM Ticket t " +
//            "WHERE t.account = :account " +
//            "AND t.ticketType.ticketTypeId = :ticketTypeId " +
//            "AND t.ticketStatus = :ticketStatus")
//    boolean existsTicket(Account account, long ticketTypeId, TicketStatus ticketStatus);

    //List<Ticket> findTicketByAccount(Account account);

    Optional<Ticket> findByTicketIdAndTicketStatusIn(long ticketId, Collection<TicketStatus> ticketStatuses);

//    @Modifying
//    @Query("UPDATE Ticket t SET t.ticketStatus = 'EXPIRED' WHERE t.ticketStatus = 'ACTIVE' AND t.validTo < :now")
//    int markTicketsAsExpired(@Param("now") LocalDateTime now);
}
