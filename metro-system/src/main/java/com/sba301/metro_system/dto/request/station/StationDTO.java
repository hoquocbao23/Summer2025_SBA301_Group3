package com.sba301.metro_system.dto.request.station;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class StationDTO {
    private String stationName;
    private String stationLocation;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String description;
    private MultipartFile image;
}
