//package com.sba301.metro_system.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Entity
//@Table(name = "ticket_type_voucher")
//@Data
//public class TicketTypePromotion {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long ticketTypeVoucherId;
//
//    @ManyToOne
//    @JoinColumn(name = "promotion_id")
//    private Promotion promotion;
//
//    @ManyToOne
//    @JoinColumn(name = "ticket_type_id")
//    private TicketType ticketType;
//}
