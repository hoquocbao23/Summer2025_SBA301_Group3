package com.sba301.metro_system.dto.request.promotion;

import com.sba301.metro_system.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PromotionRequestDto {

    @NotNull(message = "promotion name should be not null" )
    private String promotionName;
    @NotNull(message = "promotion code should be not null" )
    private String promotionCode;

    @NotNull(message = "promotion discount should be not null" )
    private BigDecimal promotionDiscount;

    @NotNull(message = "promotion date should be not null" )
    private LocalDateTime fromDate;
    @NotNull(message = "promotion date should be not null" )
    private LocalDateTime toDate;

    private Status status;
}
