package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routeId;

    @Column(unique = true)
    private String routeName;
    
    private String routeDescription;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private TicketRule ticketRule;
    
    private Double totalDistance;
    private Integer estimatedDuration;
    private Integer frequencyMinutes;
    private String operatingHours;
    private String color;

    private Status status;
}
