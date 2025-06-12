package com.sba301.metro_system.dto.request.route;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record RouteRequest(
        @Schema(description = "Route name", example = "Line 1 - Ben Thanh to Suoi Tien")
        @NotBlank(message = "Route name is required")
        @Size(min = 3, max = 100, message = "Route name must be between 3 and 100 characters")
        String routeName,
        
        @Schema(description = "Route description", example = "Main metro line connecting city center to eastern districts")
        @Size(max = 500, message = "Route description must not exceed 500 characters")
        String routeDescription,
        
        @Schema(description = "Ticket rule ID", example = "1")
        @NotNull(message = "Ticket rule ID is required")
        @Positive(message = "Ticket rule ID must be positive")
        Long ruleId,
        
        @Schema(description = "Estimated duration in minutes", example = "45")
        @NotNull(message = "Estimated duration is required")
        @Min(value = 1, message = "Estimated duration must be at least 1 minute")
        @Max(value = 300, message = "Estimated duration must not exceed 300 minutes")
        Integer estimatedDuration,
        
        @Schema(description = "Frequency in minutes", example = "5")
        @NotNull(message = "Frequency is required")
        @Min(value = 1, message = "Frequency must be at least 1 minute")
        @Max(value = 60, message = "Frequency must not exceed 60 minutes")
        Integer frequencyMinutes
) {
}
