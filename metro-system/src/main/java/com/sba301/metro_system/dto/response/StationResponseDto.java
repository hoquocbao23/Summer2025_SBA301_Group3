package com.sba301.metro_system.dto.response;

import com.sba301.metro_system.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StationResponseDto {
    private Long stationId;
    private String stationName;
    private String stationLocation;
    private String description;
    private Status status;
    private String imageUrl;
}
