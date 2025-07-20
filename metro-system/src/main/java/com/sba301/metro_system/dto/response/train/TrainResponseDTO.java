package com.sba301.metro_system.dto.response.train;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for train response")
public class TrainResponseDTO {

    @Schema(description = "Train ID", example = "1")
    private Long trainId;

    @Schema(description = "Name of the train", example = "Metro Line 1")
    private String trainName;

    @Schema(description = "Model of the train", example = "MT-2024")
    private String trainModel;

    @Schema(description = "Manufacturer of the train", example = "Metro Corp")
    private String trainManufacturer;

    @Schema(description = "Route ID if train is assigned to a route", example = "1")
    private Long routeId;
}
