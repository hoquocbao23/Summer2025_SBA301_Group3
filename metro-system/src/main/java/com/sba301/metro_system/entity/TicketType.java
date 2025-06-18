package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ticket_type")
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketTypeId;

    @Column(unique = true, nullable = false)
    private String ticketName;

    @Column(unique = true, nullable = false)
    private Integer validityDays;
    private String description;
    private Boolean usageLimit;

    @Enumerated(EnumType.STRING)
    private Status status;
}
