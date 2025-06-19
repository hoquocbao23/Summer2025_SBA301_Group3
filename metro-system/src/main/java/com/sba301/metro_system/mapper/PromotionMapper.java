package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.PromotionResponseDto;
import com.sba301.metro_system.entity.Promotion;

public class PromotionMapper {
    public static PromotionResponseDto toPromotionResponseDto(Promotion promotion) {
        PromotionResponseDto promotionResponseDto = new PromotionResponseDto();
        promotionResponseDto.setPromotionId(promotion.getPromotionId());
        promotionResponseDto.setPromotionName(promotion.getPromotionName());
        promotionResponseDto.setFromDate(promotion.getFromDate());
        promotionResponseDto.setToDate(promotion.getToDate());
        promotionResponseDto.setStatus(promotion.getStatus());
        return promotionResponseDto;
    }
}
