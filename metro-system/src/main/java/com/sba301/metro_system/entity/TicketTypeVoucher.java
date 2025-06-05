package com.sba301.metro_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ticket_type_voucher")
@Data
public class TicketTypeVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketTypeVoucherId;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;
}
