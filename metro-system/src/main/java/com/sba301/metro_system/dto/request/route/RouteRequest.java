package com.sba301.metro_system.dto.request.route;

import com.sba301.metro_system.enums.Status;
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
        Integer frequencyMinutes,

        @Schema(description = "Operating hours", example = "05:00 - 23:00")
        @Pattern(
                regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]\\s*-\\s*([01]?[0-9]|2[0-3]):[0-5][0-9]$",
                message = "Operating hours must be in format HH:MM - HH:MM (e.g., 05:00 - 23:00)"
        )
        String operatingHours,

        @Schema(description = "Route color", example = "#007bff")
        @Pattern(
                regexp = "^#(?:[0-9a-fA-F]{3}){1,2}$",
                message = "Color must be in hex format #rrggbb (e.g., #007bff)"
        )
        String color,

        @Schema(description = "Route status", example = "ACTIVE")
        Status status
) {
}
