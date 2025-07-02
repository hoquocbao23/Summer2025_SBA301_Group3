package com.sba301.metro_system.dto.response.train;

import lombok.Data;

@Data
public class TrainResponseDTO {
    private Long trainId;
    private String trainName;
    private String trainModel;
    private Long routId;
}
