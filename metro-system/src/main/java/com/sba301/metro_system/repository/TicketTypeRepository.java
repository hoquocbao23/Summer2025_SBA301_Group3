package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findAllByTicketTypeIdIn(List<Long> ids );
}
