package com.sba301.metro_system.dto.request.ticket;

import com.sba301.metro_system.entity.*;
import com.sba301.metro_system.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;


import java.util.HashSet;
import java.util.List;

@Data
public class TicketRequestDto {
    private long id;
    private long departureStation;
    private long arrivalStation;
    private long routeId;
    private long ticketTypeId;
    private String promotionCode;
    private int numberOfPassengers;
    private List<String> userEmails;
    private double total;
    private double paymentAmount;

}
