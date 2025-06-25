package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.TicketDetailResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.TicketDetail;

public class TicketDetailMapper {
    public static TicketDetailResponseDto toTicketDetailResponseDto(TicketDetail ticketDetail) {
        TicketDetailResponseDto ticketDetailResponseDto = new TicketDetailResponseDto();
        ticketDetailResponseDto.setCheckIn(ticketDetail.getCheckIn());
        ticketDetailResponseDto.setCheckOut(ticketDetail.getCheckOut());
        ticketDetailResponseDto.setRouteName(ticketDetail.getTicket().getRoute().getRouteName());
        return ticketDetailResponseDto;
    }
}
