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

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String imageUrl;

    private String imagePublicId;

}
