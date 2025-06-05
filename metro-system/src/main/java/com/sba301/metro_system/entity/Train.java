package com.sba301.metro_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "train")
public class Train {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainId;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
    
    private String trainName;
    private String trainModel;
    private String trainManufacturer;
}
