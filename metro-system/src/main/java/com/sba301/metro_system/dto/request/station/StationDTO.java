package com.sba301.metro_system.dto.request.station;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class StationDTO {
    private String stationName;
    private String stationLocation;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String url;
    private String description;
}
