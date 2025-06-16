package com.sba301.metro_system.entity;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@Table(name = "station")
@RequiredArgsConstructor
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;

    @Column(unique = true)
    private String stationName;
    
    private String stationLocation;

    private String url;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    public Station(String stationName, String stationLocation, String url, Status status, String description) {
        this.stationName = stationName;
        this.stationLocation = stationLocation;
        this.url = url;
        this.status = status;
        this.description = description;
    }
}
