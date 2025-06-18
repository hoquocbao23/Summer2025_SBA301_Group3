package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.tickettype.TicketTypeDto;
import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.TicketTypeRepository;
import com.sba301.metro_system.service.ITicketTypeService;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketTypeService implements ITicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;



    @Override
    public TicketType findById(long id) {
        return ticketTypeRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket type not found"));
    }

    @Override
    public List<TicketType> findAll() {
        return ticketTypeRepository.findAll();
    }

    @Override
    public List<TicketType> findAllByTicketTypeId(List<Long> ids) {
        return ticketTypeRepository.findAllByTicketTypeIdIn(ids);
    }

    @Override
    public TicketType createTicketType(TicketTypeDto ticketType) {
        TicketType newType = new TicketType();
        newType.setTicketName(ticketType.getTicketName());
        newType.setDescription(ticketType.getDescription());
        newType.setValidityDays(ticketType.getValidityDays());
        newType.setUsageLimit(ticketType.getUsageLimit());
        newType.setStatus(ticketType.getStatus());
        return ticketTypeRepository.save(newType);
    }

    @Override
    public void deleteTicketType(long id) {
        TicketType ticketType = findById(id);
        ticketType.setStatus(Status.INACTIVE);
        ticketTypeRepository.save(ticketType);
    }

    @Override
    public TicketType updateTicketType(long id, TicketTypeDto ticketTypeDto) {
        TicketType ticketType = findById(id);
        if (ticketTypeDto.getTicketName() != null && !ticketTypeDto.getTicketName().trim().isEmpty()) {
            ticketType.setTicketName(ticketTypeDto.getTicketName());
        }

        if (ticketTypeDto.getDescription() != null && !ticketTypeDto.getDescription().trim().isEmpty()) {
            ticketType.setDescription(ticketTypeDto.getDescription());
        }

        if (ticketTypeDto.getValidityDays() != null) {
            ticketType.setValidityDays(ticketTypeDto.getValidityDays());
        }
        if (ticketTypeDto.getUsageLimit() != null) {
            ticketType.setUsageLimit(ticketTypeDto.getUsageLimit());
        }

        if (ticketTypeDto.getStatus() != null) {
            ticketType.setStatus(ticketTypeDto.getStatus());
        }


        return ticketTypeRepository.save(ticketType);
    }

    @Override
    public List<TicketType> findAllUnlimitTicketTypes() {
        return ticketTypeRepository.findAllByUsageLimit(false);
    }
}
