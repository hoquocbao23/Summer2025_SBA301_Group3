package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


public class TicketMapper {

    public static TicketResponseDto toTicketResponseDto(Ticket ticket) {
        TicketResponseDto ticketResponseDto = new TicketResponseDto();

        if (ticket == null) {
            return ticketResponseDto;
        }

        ticketResponseDto.setTicketId(ticket.getTicketId());

        if (ticket.getDepartureStation() != null) {
            ticketResponseDto.setDepartureStation(ticket.getDepartureStation().getStationName());
        }

        if (ticket.getArrivalStation() != null) {
            ticketResponseDto.setArrivalStation(ticket.getArrivalStation().getStationName());
        }

        ticketResponseDto.setOldPrice(ticket.getOldPrice());
        ticketResponseDto.setNewPrice(ticket.getNewPrice());
        ticketResponseDto.setValidFrom(ticket.getValidFrom());
        ticketResponseDto.setValidTo(ticket.getValidTo());
        ticketResponseDto.setPurchaseTime(ticket.getPurchaseTime());
        ticketResponseDto.setQrUrl(ticket.getQrUrl());
        ticketResponseDto.setTicketStatus(ticket.getTicketStatus());

        if (ticket.getPromotion() != null) {
            ticketResponseDto.setPromotionCode(ticket.getPromotion().getPromotionCode());
        }

        if (ticket.getRoute() != null) {
            ticketResponseDto.setRouteName(ticket.getRoute().getRouteName());
        }

        return ticketResponseDto;
    }





}
