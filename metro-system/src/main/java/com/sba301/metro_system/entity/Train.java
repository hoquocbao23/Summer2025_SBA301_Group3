package com.sba301.metro_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "train")
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainId;

    private String trainName;

    private String trainModel;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}
