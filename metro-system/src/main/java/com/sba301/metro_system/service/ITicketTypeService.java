package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.tickettype.TicketTypeDto;
import com.sba301.metro_system.entity.TicketType;

import java.util.List;

public interface ITicketTypeService {
    TicketType findById(long id);
    List<TicketType> findAll();
    List<TicketType> findAllByTicketTypeId(List<Long> ids);
    TicketType createTicketType(TicketTypeDto ticketType);
    void deleteTicketType(long id);
    TicketType updateTicketType(long id, TicketTypeDto ticketType);
    List<TicketType> findAllUnlimitTicketTypes();
}
