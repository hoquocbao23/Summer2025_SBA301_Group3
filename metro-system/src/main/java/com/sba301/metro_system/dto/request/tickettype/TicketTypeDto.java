package com.sba301.metro_system.dto.request.tickettype;

import com.sba301.metro_system.enums.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketTypeDto {


    @Schema(example = "Vé tháng")
    @NotBlank(message = "Ticket name should not be blank")
    private String ticketName;

    @Schema(example = "30")
    @NotNull(message = "Validity days must be provided")
    @Min(value = 1, message = "Validity days must be at least 1")
    private Integer validityDays;

    @Schema(example = "Vé dùng trong tháng")
    @Size(max = 255, message = "Description can't exceed 255 characters")
    private String description;

    @Schema(example = "False")
    @NotNull(message = "Usage limit flag must be provided")
    private Boolean usageLimit;

    @Schema(example = "ACTIVE")
    @NotNull(message = "Status must be provided")
    private Status status;

}
