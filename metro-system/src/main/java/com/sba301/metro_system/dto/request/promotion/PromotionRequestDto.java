package com.sba301.metro_system.dto.request.promotion;

import com.sba301.metro_system.enums.Status;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionRequestDto {

    @Schema(
            example = "HCM Metro Discount"
    )
    @NotBlank(message = "promotion name should be not blank")
    private String promotionName;

    @Schema(
            example = "METRO15%"
    )
    @NotBlank(message = "promotion code should be not blank")
    private String promotionCode;

    @Schema(
            example = "15"
    )
    @NotNull(message = "promotion discount should be not null" )
    @DecimalMin(value = "0.01" , message = "discount should be > 0")
    private BigDecimal promotionDiscount;


    @NotNull(message = "promotion date should be not null")
    private LocalDateTime fromDate;

    @NotNull(message = "promotion date should be not null")
    private LocalDateTime toDate;

    private Status status;

    @Schema(
            example = "1, 2"
    )
    private List<Long> ticketTypeIds;
}
