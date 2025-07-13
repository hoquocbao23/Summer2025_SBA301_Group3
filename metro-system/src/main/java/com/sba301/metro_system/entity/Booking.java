package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.PaymentMethod;
import com.sba301.metro_system.enums.TicketStatus;
import com.sba301.metro_system.enums.TransactionStatus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "booking")
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "departure_station_id")
    private Station departureStation;

    @ManyToOne
    @JoinColumn(name = "arrival_station_id")
    private Station arrivalStation;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;


    //    private BigDecimal price;
    private Double oldPrice;

    private Double newPrice;

    private LocalDateTime purchaseTime;

    private String qrUrl;


    @Enumerated(EnumType.STRING)
    private TransactionStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY)
    private List<Ticket> tickets;


}
