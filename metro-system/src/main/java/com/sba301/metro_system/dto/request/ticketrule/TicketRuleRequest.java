package com.sba301.metro_system.dto.request.ticketrule;

import com.sba301.metro_system.enums.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record TicketRuleRequest(
        @Schema(description = "Rule name", example = "Standard Metro Pricing")
        @NotBlank(message = "Rule name is required")
        @Size(min = 3, max = 100, message = "Rule name must be between 3 and 100 characters")
        String ruleName,

        @Schema(description = "Rule description", example = "Main metro line pricing")
        @Size(max = 500, message = "Route description must not exceed 500 characters")
        String description,
        
        @Schema(description = "Base price for the ticket", example = "5000.0")
        @NotNull(message = "Base price is required")
        @DecimalMin(value = "0.0", message = "Base price must be non-negative")
        @DecimalMax(value = "1000000.0", message = "Base price must not exceed 1,000,000")
        Double basePrice,
        
        @Schema(description = "Price per kilometer", example = "2000.0")
        @NotNull(message = "Price per kilometer is required")
        @DecimalMin(value = "0.0", message = "Price per kilometer must be non-negative")
        @DecimalMax(value = "100000.0", message = "Price per kilometer must not exceed 100,000")
        Double pricePerKm,
        
        @Schema(description = "Status of the ticket rule", example = "ACTIVE")
        Status status
) {
}
