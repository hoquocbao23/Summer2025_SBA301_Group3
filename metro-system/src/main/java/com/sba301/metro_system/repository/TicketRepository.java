package com.sba301.metro_system.repository;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Ticket findByAccount(Account account);
}
