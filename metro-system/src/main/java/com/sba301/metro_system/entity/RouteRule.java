package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.RuleType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "route_rule")
public class RouteRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long routeRuleId;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private TicketRule ticketRule;

    @Enumerated(EnumType.STRING)
    private RuleType type;
}
