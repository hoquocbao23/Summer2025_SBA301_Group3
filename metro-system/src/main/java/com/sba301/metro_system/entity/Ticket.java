package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "ticket")
@NoArgsConstructor
public class Ticket {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @ManyToOne
    @JoinColumn(name = "departure_station_id")
    private Station departureStation;

    @ManyToOne
    @JoinColumn(name = "arrival_station_id")
    private Station arrivalStation;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;



    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Enumerated(EnumType.STRING)
    private TicketStatus ticketStatus;

    private LocalDateTime validFrom;

    private LocalDateTime validTo;

    private LocalDateTime purchaseTime;

    private Boolean isCheckin;
//    private BigDecimal price;
//    private Double oldPrice;
//    private Double newPrice;

//    private String qrUrl;



//    @ManyToOne
//    @JoinColumn(name = "account_id")
//    private Account account;



//    @ManyToOne
//    @JoinColumn(name = "promotion_id")
//    private Promotion promotion;
    

}
