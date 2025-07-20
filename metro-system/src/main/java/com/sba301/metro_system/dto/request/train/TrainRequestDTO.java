package com.sba301.metro_system.dto.request.train;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for train creation and update requests")
public class TrainRequestDTO {

    @Schema(description = "Name of the train", example = "Metro Line 1")
    @NotBlank(message = "Train name is required")
    @Size(min = 2, max = 50, message = "Train name must be between 2 and 50 characters")
    private String trainName;

    @Schema(description = "Model of the train", example = "MT-2024")
    @NotBlank(message = "Train model is required")
    @Size(min = 2, max = 50, message = "Train model must be between 2 and 50 characters")
    private String trainModel;

    @Schema(description = "Manufacturer of the train", example = "Metro Corp")
    @Size(max = 100, message = "Train manufacturer cannot exceed 100 characters")
    private String trainManufacturer;
}
